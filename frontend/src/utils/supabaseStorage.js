import { supabase } from '../lib/supabase'

export const uploadFotoProfil = async (file, nim) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${nim}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('foto-profil')
    .upload(fileName, file, { upsert: true })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from('foto-profil')
    .getPublicUrl(fileName)

  return urlData.publicUrl
}

export const uploadFotoAbsensi = async (base64, nim, timestamp) => {
  const fileName = `${nim}_${timestamp}.jpg`
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
  const binaryStr = atob(base64Data)
  const bytes = new Uint8Array(binaryStr.length)
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }

  const { data, error } = await supabase.storage
    .from('foto-absensi')
    .upload(fileName, bytes, {
      contentType: 'image/jpeg',
      upsert: false,
    })

  if (error) throw error
  return data.path
}
