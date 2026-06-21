import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xenucbzocrnfinblbfqj.supabase.co'
const supabaseKey = 'sb_publishable_GPv0G4Qwpb-OS34XW1tkLQ_PyW8iQJT'

export const supabase = createClient(supabaseUrl, supabaseKey)