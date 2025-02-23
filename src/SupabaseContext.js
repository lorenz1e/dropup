import { createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase-Client erstellen
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Context erstellen
const SupabaseContext = createContext(null);

// Provider für den gesamten App-Tree
export const SupabaseProvider = ({ children }) => {
    return (
        <SupabaseContext.Provider value={supabase}>
            {children}
        </SupabaseContext.Provider>
    );
};

// Custom Hook, um den Supabase-Client einfacher zu verwenden
export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (!context) {
        throw new Error("useSupabase must be used within a SupabaseProvider");
    }
    return context;
};
