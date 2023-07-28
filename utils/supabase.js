const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const saveFound = async () => {
    const { data, error } = await supabase
        .from('bits')
        .insert([
            {
                found: true,
            }
        ]);

    if (error) console.log('Error inserting data:', error);
    else console.log('Response saved:', data);

    return data;
}


const getLastFound = async () => {
    // there is only 1 row in this table
    const { data, error } = await supabase
        .from('bits')
        .select('*');

    if (error) console.log('Error getting found:', error);
    else console.log('Found:', data);

    if (data.length === 0) return null;
    return true;
}

module.exports = {
    saveFound,
    getLastFound,
}