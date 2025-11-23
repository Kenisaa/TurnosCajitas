import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type ShiftsData = {
  [key: number]: { [key: number]: string }
}

export function useSupabaseData() {
  const [shiftsData, setShiftsData] = useState<ShiftsData>({
    1: {},
    2: {},
    3: {},
    4: {},
  })
  const [exitPositions1, setExitPositions1] = useState<{ [key: number]: { x: number; y: number } }>({})
  const [exitPositions2, setExitPositions2] = useState<{ [key: number]: { x: number; y: number } }>({})
  const [image1, setImage1] = useState<string | null>(null)
  const [image2, setImage2] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Cargar datos iniciales
  useEffect(() => {
    loadAllData()
  }, [])

  async function loadAllData() {
    setLoading(true)
    try {
      await Promise.all([
        loadShiftsData(),
        loadExitPositions(),
        loadImages(),
      ])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar nombres de salidas por turno
  async function loadShiftsData() {
    const { data, error } = await supabase
      .from('shifts_data')
      .select('*')

    if (error) {
      console.error('Error loading shifts data:', error)
      return
    }

    const newShiftsData: ShiftsData = { 1: {}, 2: {}, 3: {}, 4: {} }
    data?.forEach((item) => {
      if (!newShiftsData[item.shift_number]) {
        newShiftsData[item.shift_number] = {}
      }
      newShiftsData[item.shift_number][item.exit_number] = item.exit_name
    })

    setShiftsData(newShiftsData)
  }

  // Cargar posiciones de salidas
  async function loadExitPositions() {
    const { data, error } = await supabase
      .from('exit_positions')
      .select('*')

    if (error) {
      console.error('Error loading exit positions:', error)
      return
    }

    const positions1: { [key: number]: { x: number; y: number } } = {}
    const positions2: { [key: number]: { x: number; y: number } } = {}

    data?.forEach((item) => {
      const pos = { x: Number(item.position_x), y: Number(item.position_y) }
      if (item.image_number === 1) {
        positions1[item.exit_number] = pos
      } else if (item.image_number === 2) {
        positions2[item.exit_number] = pos
      }
    })

    setExitPositions1(positions1)
    setExitPositions2(positions2)
  }

  // Cargar imágenes
  async function loadImages() {
    const { data, error } = await supabase
      .from('emergency_images')
      .select('*')

    if (error) {
      console.error('Error loading images:', error)
      return
    }

    data?.forEach((item) => {
      if (item.image_number === 1) {
        setImage1(item.image_data)
      } else if (item.image_number === 2) {
        setImage2(item.image_data)
      }
    })
  }

  // Guardar nombre de salida
  async function saveExitName(shiftNumber: number, exitNumber: number, exitName: string) {
    const { error } = await supabase
      .from('shifts_data')
      .upsert({
        shift_number: shiftNumber,
        exit_number: exitNumber,
        exit_name: exitName,
      }, {
        onConflict: 'shift_number,exit_number'
      })

    if (error) {
      console.error('Error saving exit name:', error)
      throw error
    }

    // Actualizar estado local
    setShiftsData((prev) => ({
      ...prev,
      [shiftNumber]: {
        ...prev[shiftNumber],
        [exitNumber]: exitName,
      },
    }))
  }

  // Guardar posiciones de salidas
  async function saveExitPositions(imageNumber: number, positions: { [key: number]: { x: number; y: number } }) {
    const positionsArray = Object.entries(positions).map(([exitNumber, pos]) => ({
      image_number: imageNumber,
      exit_number: Number(exitNumber),
      position_x: pos.x,
      position_y: pos.y,
    }))

    const { error } = await supabase
      .from('exit_positions')
      .upsert(positionsArray, {
        onConflict: 'image_number,exit_number'
      })

    if (error) {
      console.error('Error saving exit positions:', error)
      throw error
    }

    // Actualizar estado local
    if (imageNumber === 1) {
      setExitPositions1(positions)
    } else if (imageNumber === 2) {
      setExitPositions2(positions)
    }
  }

  // Guardar imagen
  async function saveImage(imageNumber: number, imageData: string) {
    const { error } = await supabase
      .from('emergency_images')
      .upsert({
        image_number: imageNumber,
        image_data: imageData,
      }, {
        onConflict: 'image_number'
      })

    if (error) {
      console.error('Error saving image:', error)
      throw error
    }

    // Actualizar estado local
    if (imageNumber === 1) {
      setImage1(imageData)
    } else if (imageNumber === 2) {
      setImage2(imageData)
    }
  }

  // Eliminar todos los datos
  async function clearAllData() {
    try {
      await Promise.all([
        supabase.from('shifts_data').delete().neq('id', 0),
        supabase.from('exit_positions').delete().neq('id', 0),
        supabase.from('emergency_images').delete().neq('id', 0),
      ])

      // Resetear estados locales
      setShiftsData({ 1: {}, 2: {}, 3: {}, 4: {} })
      setExitPositions1({})
      setExitPositions2({})
      setImage1(null)
      setImage2(null)
    } catch (error) {
      console.error('Error clearing data:', error)
      throw error
    }
  }

  return {
    shiftsData,
    exitPositions1,
    exitPositions2,
    image1,
    image2,
    loading,
    saveExitName,
    saveExitPositions,
    saveImage,
    clearAllData,
    reloadData: loadAllData,
  }
}
