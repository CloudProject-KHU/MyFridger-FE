import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CarrotIcon from '@/assets/images/character/carrot-character.svg';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // 애니메이션 값들
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const headerSlideAnim = useRef(new Animated.Value(30)).current;
  const formFadeAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(30)).current;
  const characterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 헤더 애니메이션
    Animated.parallel([
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // 입력 필드와 버튼 애니메이션 (헤더 이후에 시작)
    Animated.parallel([
      Animated.timing(formFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 캐릭터 위아래 애니메이션
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(characterAnim, {
          toValue: -15,
          duration: 1250,
          useNativeDriver: true,
        }),
        Animated.timing(characterAnim, {
          toValue: 0,
          duration: 1250,
          useNativeDriver: true,
        }),
      ])
    );
    bounceAnimation.start();

    return () => {
      bounceAnimation.stop();
    };
  }, []);

  const handleSubmit = () => {
    // TODO: 실제 로그인 API 연동
    console.log('로그인 시도:', { email, password });

    // 임시로 홈 탭으로 이동
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={['#FFF8E7', '#FFE5B8', '#FFF8E7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.root}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.container}>
            <Animated.View
              style={[
                styles.header,
                {
                  opacity: headerFadeAnim,
                  transform: [{ translateY: headerSlideAnim }],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  {
                    transform: [{ translateY: characterAnim }],
                  },
                ]}
              >
                <CarrotIcon width={180} height={180} />
              </Animated.View>
              <Text style={styles.title}>냉장고 관리</Text>
              <Text style={styles.subtitle}>신선함을 지키는 가장 쉬운 방법</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: formFadeAnim,
                  transform: [{ translateY: formSlideAnim }],
                },
              ]}
            >
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

              <Pressable
                style={styles.backButton}
                onPress={() => router.replace('/onboarding')}
              >
                <Text style={styles.backButtonText}>← 뒤로</Text>
              </Pressable>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
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
  formContainer: {
    width: '100%',
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
  backButton: {
    width: '100%',
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#666666',
  },
});










