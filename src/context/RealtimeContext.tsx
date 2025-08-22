import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { supabase } from '../api/user';

interface RealtimeContextType {
  subscribeTo: (tables: string[], callback: () => void) => () => void;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(
  undefined,
);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [subscribers, setSubscribers] = useState<Map<string, Set<() => void>>>(
    new Map(),
  );
  const [channel, setChannel] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleTableChange = useCallback(
    (tableName: string) => {
      const callbacks = subscribers.get(tableName);
      if (callbacks) {
        callbacks.forEach((callback) => callback());
      }
    },
    [subscribers],
  );

  useEffect(() => {
    const newChannel = supabase
      .channel('global_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_jobs' },
        () => handleTableChange('user_jobs'),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => handleTableChange('profiles'),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'punishment' },
        () => handleTableChange('punishment'),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        () => handleTableChange('jobs'),
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    setChannel(newChannel);

    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel);
      }
    };
  }, [handleTableChange]);

  const subscribeTo = useCallback((tables: string[], callback: () => void) => {
    setSubscribers((prev) => {
      const newSubscribers = new Map(prev);

      tables.forEach((table) => {
        if (!newSubscribers.has(table)) {
          newSubscribers.set(table, new Set());
        }
        newSubscribers.get(table)!.add(callback);
      });

      return newSubscribers;
    });

    // Return unsubscribe function
    return () => {
      setSubscribers((prev) => {
        const newSubscribers = new Map(prev);

        tables.forEach((table) => {
          const callbacks = newSubscribers.get(table);
          if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
              newSubscribers.delete(table);
            }
          }
        });

        return newSubscribers;
      });
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ subscribeTo, isConnected }}>
      {children}
    </RealtimeContext.Provider>
  );
};
