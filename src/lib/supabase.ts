import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://mgsbxvttetlpcrvdfsed.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nc2J4dnR0ZXRscGNydmRmc2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjQwODIsImV4cCI6MjA2NTM0MDA4Mn0.TN8BlSXWlMnLKhXrpjyal1ncT7Lr_lnVgv5tpwmXEwQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});