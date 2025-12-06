import { useRouter } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CarrotIcon from '@/assets/images/carrot.svg';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = () => {
    // TODO: 실제 로그인 API 연동
    console.log('로그인 시도:', { email, password });

    // 임시로 홈 탭으로 이동
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <CarrotIcon width={180} height={180} />
            </View>
            <Text style={styles.title}>냉장고 관리</Text>
            <Text style={styles.subtitle}>신선함을 지키는 가장 쉬운 방법</Text>
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="이메일"
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              placeholderTextColor="#999999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Pressable style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    marginBottom: 16,
    //opacity: 0.6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFAE2C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 52,
    //borderWidth: 1,
    //borderColor: '#E0E0E0',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111111',
    backgroundColor: '#FFFFFF',
  },
  loginButton: {
    width: '100%',
    height: 52,
    marginTop: 32,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFAE2C',
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});










