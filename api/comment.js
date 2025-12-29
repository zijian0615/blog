import { createClient } from '@supabase/supabase-js'

// 从环境变量读取
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { page, name, content, parent_id } = req.body
    const { data, error } = await supabase
      .from('comments')
      .insert([{ page, name, content, parent_id }])
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  if (req.method === 'GET') {
    const { page } = req.query
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('page', page)
      .order('created_at', { ascending: true })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
