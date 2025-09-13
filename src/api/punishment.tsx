import { supabase } from './user';
import { Punishment } from '../types/punishment';

export async function addPunishment(userId: string, amount: number, reason: string) {
    // Start a transaction by using RPC function or do it manually
    const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('money')
        .eq('id', userId)
        .single();

    if (userError) throw userError;

    const currentMoney = userData.money || 0;
    const newMoney = currentMoney - amount;

    // Update user's money
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ money: newMoney })
        .eq('id', userId);

    if (updateError) throw updateError;

    // Insert punishment record
    const { data, error } = await supabase
        .from('punishment')
        .insert([{
            user_id: userId,
            amount,
            reason
        }])
        .select();

    if (error) {
        // If punishment insert fails, rollback the money update
        await supabase
            .from('profiles')
            .update({ money: currentMoney })
            .eq('id', userId);
        throw error;
    }

    return data[0] as Punishment;
}

export async function getPunishments() {
    const { data, error } = await supabase
        .from('punishment')
        .select(`
      *,
      profiles(name)
    `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as (Punishment & { profiles: { name: string } })[];
}

export async function getUserPunishments(userId: string) {
    const { data, error } = await supabase
        .from('punishment')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Punishment[];
}

export async function deletePunishment(punishmentId: number) {
    const { data, error } = await supabase
        .from('punishment')
        .delete()
        .eq('id', punishmentId)
        .select();

    if (error) throw error;
    return data;
}

export async function getLatest15Punishments() {
    const { data, error } = await supabase
        .from('punishment')
        .select(`
      *,
      profiles(name)
    `)
        .order('created_at', { ascending: false })
        .limit(15);

    if (error) throw error;
    return data as (Punishment & { profiles: { name: string } })[];
}