import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { calculateCaloriesForActivity } from '../../services/nutritionix';
import { AuthButton } from './AuthButton';

export const ApiTest: React.FC = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testApiCall = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Testing Nutritionix API call...');
      
      // Test with a simple exercise
      const calories = await calculateCaloriesForActivity('running', 30, 70);
      
      setResult({
        success: true,
        calories,
        message: 'API call successful!'
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setResult({
        success: false,
        error: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: theme.colors.background, flex: 1 }}>
      <Text style={{ color: theme.colors.onBackground, fontSize: 18, marginBottom: 20 }}>
        Nutritionix API Test
      </Text>
      
      <AuthButton
        title="Test API Call (Running 30min)"
        onPress={testApiCall}
        loading={isLoading}
      />

      {error && (
        <View style={{ marginTop: 20, padding: 10, backgroundColor: theme.colors.error + '20', borderRadius: 8 }}>
          <Text style={{ color: theme.colors.error, fontWeight: 'bold' }}>Error:</Text>
          <Text style={{ color: theme.colors.error }}>{error}</Text>
        </View>
      )}

      {result && (
        <ScrollView style={{ marginTop: 20 }}>
          <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>
            Result:
          </Text>
          <Text style={{ color: theme.colors.onSurface }}>
            {JSON.stringify(result, null, 2)}
          </Text>
        </ScrollView>
      )}

      <View style={{ marginTop: 20 }}>
        <Text style={{ color: theme.colors.onSurface, fontSize: 12 }}>
          Check console for detailed API request/response logs
        </Text>
      </View>
    </View>
  );
};