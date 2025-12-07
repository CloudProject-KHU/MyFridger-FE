/**
 * 온보딩 화면
 * - 앱 첫 실행 시 사용자에게 주요 기능 소개
 * - 3개의 슬라이드로 구성
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import CarrotCameraIcon from '@/assets/images/character/carrot-camera.svg';
import CarrotNiceIcon from '@/assets/images/character/carrot-nice.svg';
import CarrotStudyIcon from '@/assets/images/character/carrot-study.svg';
import ActionButton from '@/shared/components/buttons/ActionButton';
import { setOnboardingCompleted } from '@features/onboarding/services/onboarding.storage';

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  floatingIcons: string[];
};

const slides: Slide[] = [
  {
    title: '냉장고를 스마트하게',
    subtitle: '관리해보세요',
    description: '음식물 쓰레기를 줄이고\n신선한 재료로 요리하세요',
    icon: '🥗',
    floatingIcons: ['🥕', '🥦', '🍅', '🥒', '🧄'],
  },
  {
    title: '영수증만 찍으면',
    subtitle: '자동으로 등록',
    description: '재료를 일일이 입력할 필요 없이\n영수증 사진으로 한 번에 추가',
    icon: '📸',
    floatingIcons: ['🧾', '📱', '✨', '🛒', '💳'],
  },
  {
    title: 'AI가 유통기한을',
    subtitle: '자동으로 추정',
    description: '재료별 특성을 분석해\n최적의 유통기한을 알려드려요',
    icon: '✨',
    floatingIcons: ['🤖', '📅', '⏰', '🎯', '💡'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  // 애니메이션 값들
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const floatingAnims = useRef(
    slides[0].floatingIcons.map(() => ({
      translateY: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  ).current;

  // 메인 아이콘 애니메이션
  const mainIconAnim = useRef(new Animated.Value(0)).current;
  
  // 인디케이터 애니메이션 값들
  const indicatorAnims = useRef(
    slides.map((_, index) => ({
      width: new Animated.Value(index === 0 ? 32 : 8),
      opacity: new Animated.Value(index === 0 ? 1 : 0.5),
      active: new Animated.Value(index === 0 ? 1 : 0),
    }))
  ).current;

  useEffect(() => {
    // 메인 아이콘 위아래 애니메이션
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(mainIconAnim, {
          toValue: -30,
          duration: 1250,
          useNativeDriver: true,
        }),
        Animated.timing(mainIconAnim, {
          toValue: 0,
          duration: 1250,
          useNativeDriver: true,
        }),
      ])
    );
    bounceAnimation.start();

    // 떠다니는 아이콘들 애니메이션
    floatingAnims.forEach((anim, index) => {
      const delay = index * 200;
      const floatAnimation = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim.translateY, {
              toValue: -20,
              duration: 1500 + index * 200,
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: 1,
              duration: 2000 + index * 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(anim.translateY, {
              toValue: 0,
              duration: 1500 + index * 200,
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: 0,
              duration: 2000 + index * 300,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      floatAnimation.start();
    });

    return () => {
      bounceAnimation.stop();
      floatingAnims.forEach((anim) => {
        anim.translateY.stopAnimation();
        anim.rotate.stopAnimation();
      });
    };
  }, []);

  // 슬라이드 변경 시 애니메이션
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // 인디케이터 애니메이션
    indicatorAnims.forEach((anim, index) => {
      Animated.parallel([
        Animated.timing(anim.width, {
          toValue: index === currentSlide ? 32 : 8,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(anim.opacity, {
          toValue: index === currentSlide ? 1 : 0.5,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(anim.active, {
          toValue: index === currentSlide ? 1 : 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    });
  }, [currentSlide]);

  const nextSlide = async () => {
    if (currentSlide < slides.length - 1) {
      const nextIndex = currentSlide + 1;
      setCurrentSlide(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * Dimensions.get('window').width,
        animated: true,
      });
    } else {
      // 마지막 슬라이드에서 시작하기 버튼 클릭 시 온보딩 완료 처리 후 로그인 화면으로 이동
      await setOnboardingCompleted(true);
      router.replace('/auth/login');
    }
  };

  const skip = async () => {
    await setOnboardingCompleted(true);
    router.replace('/auth/login');
  };

  const handleScroll = (event: any) => {
    const slideWidth = Dimensions.get('window').width;
    const offsetX = event.nativeEvent.contentOffset?.x || 0;
    const index = Math.round(offsetX / slideWidth);
    if (index !== currentSlide && index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  };

  const currentSlideData = slides[currentSlide];

  // 떠다니는 아이콘 위치
  const floatingPositions = [
    { top: '10%', left: '15%' },
    { top: '20%', right: '10%' },
    { bottom: '25%', left: '10%' },
    { bottom: '15%', right: '15%' },
    { top: '50%', left: '5%' },
  ];

  return (
    <LinearGradient
      colors={['#FFF8E7', '#FFE5B8', '#FFF8E7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Skip 버튼 */}
        {currentSlide < slides.length - 1 && (
          <Pressable
            style={[styles.skipButton, { top: insets.top + 16 }]}
            onPress={skip}
          >
            <Text style={styles.skipButtonText}>SKIP</Text>
          </Pressable>
        )}

        {/* 메인 콘텐츠 */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {slides.map((slide, slideIndex) => (
            <View key={slideIndex} style={styles.slideContainer}>
              <View style={styles.content}>
                <View style={styles.mainContent}>
                  {/* 아이콘 영역 */}
                  <View style={styles.iconArea}>
                    {/* 중앙 메인 아이콘 */}
                    <Animated.View
                      style={[
                        styles.mainIconContainer,
                        {
                          transform: [{ translateY: mainIconAnim }],
                        },
                      ]}
                    >
                      {slideIndex === 0 ? (
                        <CarrotNiceIcon width={250} height={250} />
                      ) : slideIndex === 1 ? (
                        <CarrotCameraIcon width={250} height={250} />
                      ) : slideIndex === 2 ? (
                        <CarrotStudyIcon width={250} height={250} />
                      ) : (
                        <Text style={styles.mainIcon}>{slide.icon}</Text>
                      )}
                    </Animated.View>

                    {/* 떠다니는 작은 아이콘들 */}
                    {slide.floatingIcons.map((icon, index) => {
                      const position = floatingPositions[index];
                      const anim = floatingAnims[index];
                      const rotate = anim.rotate.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '5deg'],
                      });

                      return (
                        <Animated.View
                          key={`${slideIndex}-${index}`}
                          style={[
                            styles.floatingIcon,
                            position as any,
                            {
                              transform: [
                                { translateY: anim.translateY },
                                { rotate },
                              ],
                              opacity: 0.7,
                            },
                          ]}
                        >
                          <Text style={styles.floatingIconText}>{icon}</Text>
                        </Animated.View>
                      );
                    })}
                  </View>

                  {/* 텍스트 콘텐츠 */}
                  <Animated.View
                    style={[
                      styles.textContainer,
                      {
                        opacity: slideIndex === currentSlide ? fadeAnim : 1,
                        transform: [
                          {
                            translateY:
                              slideIndex === currentSlide ? slideAnim : 0,
                          },
                        ],
                      },
                    ]}
                  >
                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.subtitle}>{slide.subtitle}</Text>
                    <Text style={styles.description}>{slide.description}</Text>
                  </Animated.View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* 하단 네비게이션 */}
        <View style={styles.bottomNavigation}>
          {/* 인디케이터 */}
          <View style={styles.indicators}>
            {slides.map((_, index) => {
              const anim = indicatorAnims[index];
              const backgroundColor = anim.active.interpolate({
                inputRange: [0, 1],
                outputRange: ['#D1D5DB', '#FFAE2C'],
              });
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      width: anim.width,
                      backgroundColor,
                      opacity: anim.opacity,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* 버튼 */}
          <View style={styles.buttons}>
            <ActionButton
              label={currentSlide === slides.length - 1 ? '시작하기' : '다음'}
              onPress={nextSlide}
              style={styles.button}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  skipButton: {
    position: 'absolute',
    right: 24,
    zIndex: 20,
    padding: 8,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  slideContainer: {
    width: Dimensions.get('window').width,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  mainContent: {
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
  },
  iconArea: {
    width: '100%',
    height: 320,
    marginBottom: 32,
    position: 'relative',
  },
  mainIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainIcon: {
    fontSize: 96,
  },
  floatingIcon: {
    position: 'absolute',
  },
  floatingIconText: {
    fontSize: 32,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFAE2C',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#4B5563',
    lineHeight: 28,
    textAlign: 'center',
  },
  bottomNavigation: {
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  indicatorActive: {
    width: 32,
    backgroundColor: '#FFAE2C',
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
    marginBottom: 0,
  },
});

