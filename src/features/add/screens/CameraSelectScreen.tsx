import React from 'react';
import {
  Alert,
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ReceiptIcon from '@/assets/images/receipt.svg';
import IngredientSelectableCard from '@features/add/components/IngredientSelectableCard';
import { Ingredient } from '@features/ingredients/types';
import { requestCameraPermissionsAsync } from '@shared/camera/camera';
import ActionButton from '@shared/components/buttons/ActionButton';
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const CARD_COLUMNS = 4;
const CARD_GAP = 10;
const HORIZONTAL_PADDING = 16;

const SAMPLE_RECOGNIZED: Ingredient[] = [
  { id: 'ocr-1', name: '간장', category: 'seasoning', iconId: 'soy_sauce' },
  { id: 'ocr-2', name: '양파', category: 'vegetable', iconId: 'onion' },
  { id: 'ocr-3', name: '우유', category: 'dairy_processed', iconId: 'milk' },
  { id: 'ocr-4', name: '상추', category: 'vegetable', iconId: 'lettuce' },
  { id: 'ocr-5', name: '돼지고기', category: 'meat', iconId: 'pork' },
  { id: 'ocr-6', name: '새우', category: 'seafood', iconId: 'shrimp' },
  { id: 'ocr-7', name: '치즈', category: 'dairy_processed', iconId: 'cheese' },
  { id: 'ocr-8', name: '사과', category: 'fruit', iconId: 'apple' },
];

const keyExtractor = (item: Ingredient) => item.id;

export default function CameraSelectScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const [isCameraOpen, setCameraOpen] = React.useState(false);
  const [isResultModalOpen, setResultModalOpen] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [hasLibraryPermission, setHasLibraryPermission] = React.useState<boolean | null>(null);
  const [recognizedImageUri, setRecognizedImageUri] = React.useState<string | null>(null);
  const [recognized, setRecognized] = React.useState<Ingredient[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const cameraRef = React.useRef<CameraView>(null);

  const hasRecognized = recognized.length > 0;

  const cardWidth = React.useMemo(() => {
    const containerWidth = screenWidth - HORIZONTAL_PADDING * 2;
    return (containerWidth - CARD_GAP * (CARD_COLUMNS - 1)) / CARD_COLUMNS;
  }, [screenWidth]);

  const handleOpenCamera = async () => {
    const { granted } = await requestCameraPermissionsAsync();
    setHasCameraPermission(granted);
    if (!granted) {
      Alert.alert('카메라 접근이 필요합니다', '설정에서 카메라 권한을 허용해 주세요.');
      return;
    }
    setCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setCameraOpen(false);
  };

  const handleCapture = async () => {
    try {
      if (!cameraRef.current) {
        return;
      }
      // 실사용에서는 takePictureAsync 결과를 OCR에 전달
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setRecognizedImageUri(photo?.uri ?? null);
      setRecognized(SAMPLE_RECOGNIZED);
      setSelectedIds(SAMPLE_RECOGNIZED.map((item) => item.id));
      setCameraOpen(false);
      setResultModalOpen(true);
    } catch (error) {
      console.error(error);
      Alert.alert('촬영에 실패했습니다', '다시 시도해 주세요.');
    }
  };

  const handlePickFromAlbum = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const granted = status === 'granted';
    setHasLibraryPermission(granted);
    if (!granted) {
      Alert.alert('앨범 접근이 필요합니다', '설정에서 사진 접근 권한을 허용해 주세요.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets?.[0];
      setRecognizedImageUri(asset?.uri ?? null);
      setRecognized(SAMPLE_RECOGNIZED.slice(0, 4));
      setSelectedIds(SAMPLE_RECOGNIZED.slice(0, 4).map((item) => item.id));
      setCameraOpen(false);
      setResultModalOpen(true);
    }
  };

  const handleToggleIngredient = (ingredient: Ingredient) => {
    setSelectedIds((prev) =>
      prev.includes(ingredient.id)
        ? prev.filter((id) => id !== ingredient.id)
        : [...prev, ingredient.id],
    );
  };

  const renderIngredient = ({ item, index }: { item: Ingredient; index: number }) => {
    const isLastInRow = (index + 1) % CARD_COLUMNS === 0;
    return (
      <View
        style={[
          styles.cardWrapper,
          {
            width: cardWidth,
            marginRight: isLastInRow ? 0 : CARD_GAP,
          },
        ]}
      >
        <IngredientSelectableCard
          ingredient={item}
          selected={selectedIds.includes(item.id)}
          onPress={handleToggleIngredient}
        />
      </View>
    );
  };

  const selectedCount = selectedIds.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.banner} activeOpacity={0.85} onPress={handleOpenCamera}>
            <ReceiptIcon width={40} height={40} />
            <View style={styles.bannerTexts}>
              <Text style={styles.bannerTitle}>여기를 눌러 영수증 스캔을 시작하세요</Text>
              <Text style={styles.bannerDescription}>
                카메라로 촬영하거나 스크린샷을 업로드하면{'\n'}AI가 재료를 자동으로 인식해 추가합니다.
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.recognizedHeader}>
            <Text style={styles.recognizedTitle}>인식된 식재료</Text>
            <Text style={styles.recognizedHint}>
              인식되지 않은 식재료는 직접 추가 기능을 통해 추가해주세요.
            </Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          {hasRecognized ? (
            <FlatList
              data={recognized}
              keyExtractor={keyExtractor}
              renderItem={renderIngredient}
              numColumns={CARD_COLUMNS}
              columnWrapperStyle={[
                styles.columnWrapper,
                { paddingHorizontal: HORIZONTAL_PADDING },
              ]}
              contentContainerStyle={styles.gridContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>인식된 식재료가 없습니다.</Text>
              <Text style={styles.emptyDescription}>
                영수증을 촬영하여 빠르게 식재료를 추가해 보세요.
              </Text>
            </View>
          )}
        </View>
      </View>
      <ActionButton
        label={selectedCount > 0 ? `재료 추가하기 ${selectedCount}개` : '재료 추가하기'}
        tone="primary"
        disabled={selectedCount === 0}
        style={styles.actionButton}
        onPress={() => {
          // TODO: 선택된 재료를 저장 로직과 연결
        }}
      />

      <Modal visible={isCameraOpen} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.cameraContainer}>
          <View style={styles.cameraHeader}>
            <Text style={styles.cameraTitle}>식재료 추가</Text>
            <Text style={styles.cameraSubtitle}>영수증을 촬영해주세요!</Text>
            <Pressable onPress={handleCloseCamera} hitSlop={10} style={styles.cameraClose}>
              <Text style={styles.cameraCloseText}>✕</Text>
            </Pressable>
          </View>
          {hasCameraPermission ? (
            <CameraView
              ref={cameraRef}
              style={styles.cameraPreview}
              facing="back"
              mode="picture"
              enableTorch={false}
            >
              <View style={styles.cameraOverlay}>
                <Text style={styles.cameraInstruction}>영수증을 프레임에 맞춰주세요</Text>
              </View>
            </CameraView>
          ) : (
            <View style={styles.cameraPreview}>
              <Text style={styles.cameraPreviewText}>카메라 권한이 필요합니다.</Text>
            </View>
          )}
          <View style={styles.cameraToolbar}>
            <TouchableOpacity style={styles.albumButton} onPress={handlePickFromAlbum}>
              <Text style={styles.albumText}>앨범</Text>
            </TouchableOpacity>
            <Pressable style={styles.shutterOuter} onPress={handleCapture}>
              <View style={styles.shutterInner} />
            </Pressable>
            <View style={styles.toolbarSpacer} />
          </View>
        </View>
      </Modal>

      <Modal visible={isResultModalOpen} transparent animationType="fade">
        <View style={styles.resultOverlay}>
          <View style={styles.resultContainer}>
            <View style={styles.resultBanner}>
              <Text style={styles.resultBannerTitle}>영수증 인식이 완료되었습니다</Text>
              <Text style={styles.resultBannerSubtitle}>
                잘못 인식된 식재료는 완료 후 삭제 또는 직접 추가를 해주세요.
              </Text>
              <Pressable style={styles.resultClose} onPress={() => setResultModalOpen(false)}>
                <Text style={styles.resultCloseText}>✕</Text>
              </Pressable>
            </View>
            {recognizedImageUri ? (
              <ImageBackground
                source={{ uri: recognizedImageUri }}
                style={styles.resultImage}
                resizeMode="cover"
              >
                <View style={styles.resultTags}>
                  {recognized.map((item) => (
                    <View key={item.id} style={styles.resultTag}>
                      <Text style={styles.resultTagText}>{item.name}</Text>
                    </View>
                  ))}
                </View>
              </ImageBackground>
            ) : (
              <View style={[styles.resultImage, styles.resultPlaceholder]}>
                <ReceiptIcon width={56} height={56} />
                <Text style={styles.resultPlaceholderText}>영수증 미리보기</Text>
              </View>
            )}
            <View style={styles.resultActions}>
              <Pressable
                style={styles.resultActionButton}
                onPress={() => {
                  setResultModalOpen(false);
                  setCameraOpen(true);
                }}
              >
                <Text style={styles.resultActionText}>← 다시 촬영</Text>
              </Pressable>
              <Pressable
                style={styles.resultActionButton}
                onPress={() => setResultModalOpen(false)}
              >
                <Text style={styles.resultActionText}>✓ 확인</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 24,
  },
  banner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#F8E8D6',
  },
  bannerTexts: {
    gap: 6,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5A3E1B',
    textAlign: 'center',
  },
  bannerDescription: {
    fontSize: 12,
    color: '#8C7357',
    textAlign: 'center',
  },
  recognizedHeader: {
    gap: 6,
  },
  recognizedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
  },
  recognizedHint: {
    fontSize: 12,
    color: '#999999',
  },
  gridContainer: {
    flex: 1,
  },
  gridContent: {
    paddingBottom: 24,
    gap: CARD_GAP,
  },
  cardWrapper: {
    marginBottom: CARD_GAP,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  emptyState: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionButton: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraHeader: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF7A00',
  },
  cameraSubtitle: {
    marginTop: 6,
    fontSize: 16,
    color: '#FFFFFF',
  },
  cameraClose: {
    position: 'absolute',
    right: 24,
    top: 0,
  },
  cameraCloseText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  cameraPreview: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 96,
    borderRadius: 16,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cameraPreviewText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  cameraOverlay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 32,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cameraInstruction: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cameraToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  albumButton: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  toolbarSpacer: {
    width: 60,
  },
  resultOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
  },
  resultBanner: {
    backgroundColor: '#111111',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  resultBannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF7A00',
    textAlign: 'center',
  },
  resultBannerSubtitle: {
    marginTop: 8,
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  resultClose: {
    position: 'absolute',
    top: 16,
    right: 20,
  },
  resultCloseText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  resultImage: {
    height: 320,
    padding: 20,
    justifyContent: 'center',
  },
  resultPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#F4F4F4',
  },
  resultPlaceholderText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultTags: {
    position: 'absolute',
    right: 16,
    top: 16,
    gap: 12,
  },
  resultTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FF8C32',
  },
  resultTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  resultActionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F4F4F4',
  },
  resultActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
  },
});

