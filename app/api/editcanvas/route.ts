import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET(req: Request) {
    const { data, error } = await supabase
        .from('pages')
        .select('*, panels(*)')

        
    if (data){
        const pages = data[0]

    }
    console.log("data:", data)
    console.log("error:", error)

    return NextResponse.json({ data })
}

