import { createClient } from '@supabase/supabase-js';

// @ts-ignore
export async function loader({ params }: LoaderArgs) {
    let param = JSON.parse(params);
    // @ts-ignore
    const supabase = createClient(process.env.REACT_APP_SUPABASE_URL?.toString(), process.env.REACT_APP_SUPABASE_ANON_KEY?.toString());
    const { data } = await supabase.from('user_predict').select().eq('id', param.user.id);
    let already_exists = false;
    try {
      // @ts-ignore
      already_exists = data[0].id == param.user.id;
    } catch {
      already_exists = false;
    }
    if (already_exists == false) {
        await supabase.from('user_predict').insert({ id: param.user.id, created_at: new Date().toDateString(), name: param.user.name})
    }
}