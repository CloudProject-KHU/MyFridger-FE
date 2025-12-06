import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ArrowIcon from "@/assets/images/^.svg";
import CalendarIcon from "@/assets/images/calendar-grey.svg";
import CloseIcon from "@/assets/images/close.svg";
import PlusIcon from "@/assets/images/plus.svg";
import { createMaterialManual, estimateExpiryDate } from "@features/ingredients/services/ingredients.api";
import ActionButton from "@shared/components/buttons/ActionButton";
import DatePickerModal from "@shared/components/calendar/DatePickerModal";
import QuantityControl from "@shared/components/inputs/QuantityControl";
import Header from "@shared/components/navigation/Header";
import {
  INGREDIENT_CATEGORY_LABELS,
  INGREDIENT_CATEGORY_OPTIONS,
} from "@shared/constants/ingredientCategories";
import { formatDate } from "@shared/utils/dateFormat";

type IngredientFormData = {
  id: string;
  name: string;
  quantity: number;
  category: string;
  addedDate: string;
  expirationDate: string;
};

export default function ManualAddScreen() {
  const today = new Date().toISOString().split("T")[0];
  const formattedToday = formatDate(new Date());

  const router = useRouter();
  const navigation = useNavigation();

  const [ingredients, setIngredients] = React.useState<IngredientFormData[]>([
    {
      id: "1",
      name: "",
      quantity: 1,
      category: "",
      addedDate: today,
      expirationDate: today,
    },
  ]);

  const [categoryDropdownVisible, setCategoryDropdownVisible] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [datePickerVisible, setDatePickerVisible] = React.useState<{
    ingredientId: string;
    field: "addedDate" | "expirationDate";
  } | null>(null);
  const [aiLoadingIngredientId, setAiLoadingIngredientId] = React.useState<string | null>(null);

  const toggleCategoryDropdown = (ingredientId: string) => {
    setCategoryDropdownVisible((prev) => ({
      ...prev,
      [ingredientId]: !prev[ingredientId],
    }));
  };

  const handleAddContainer = React.useCallback(() => {
    const newIngredient: IngredientFormData = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      category: "",
      addedDate: today,
      expirationDate: today,
    };
    setIngredients((prev) => [...prev, newIngredient]);
  }, [today]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Header
          title="재료 직접 추가하기"
          showBackButton
          onBackPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          rightButton={{
            icon: PlusIcon,
            onPress: handleAddContainer,
          }}
        />
      ),
    });
  }, [navigation, handleAddContainer]);

  const handleRemoveContainer = (id: string) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const handleUpdateField = (
    id: string,
    field: keyof IngredientFormData,
    value: string | number
  ) => {
    setIngredients(
      ingredients.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSelectCategory = (ingredientId: string, categoryValue: string) => {
    handleUpdateField(ingredientId, "category", categoryValue);
    setCategoryDropdownVisible((prev) => ({ ...prev, [ingredientId]: false }));
  };

  const handleSelectDate = (date: string) => {
    if (datePickerVisible) {
      handleUpdateField(
        datePickerVisible.ingredientId,
        datePickerVisible.field,
        date
      );
      setDatePickerVisible(null);
    }
  };

  const handleQuantityChange = (ingredientId: string, newValue: number) => {
    setIngredients(
      ingredients.map((item) =>
        item.id === ingredientId
          ? { ...item, quantity: newValue }
          : item
      )
    );
  };

  const handleAddDuration = (
    ingredientId: string,
    type: "day" | "week" | "month"
  ) => {
    const ingredient = ingredients.find((i) => i.id === ingredientId);
    if (!ingredient) return;

    const currentDate = new Date(ingredient.expirationDate);
    const newDate = new Date(currentDate);

    switch (type) {
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }

    handleUpdateField(
      ingredientId,
      "expirationDate",
      newDate.toISOString().split("T")[0]
    );
  };

  const handleAIClick = async (ingredientId: string) => {
    const ingredient = ingredients.find((i) => i.id === ingredientId);
    if (!ingredient) return;

    const missingFields: string[] = [];
    if (ingredient.name.trim() === "") {
      missingFields.push("재료 이름");
    }
    if (ingredient.category === "") {
      missingFields.push("카테고리");
    }

    if (missingFields.length > 0) {
      const message = missingFields.map((field) => `${field}을 채워주세요!`).join("\n");
      Alert.alert("입력 필요", message);
      return;
    }

    setAiLoadingIngredientId(ingredientId);

    // 모달이 렌더링될 시간을 주기 위해 약간의 딜레이
    await new Promise((resolve) => setTimeout(resolve, 100));

    const startTime = Date.now();
    const MIN_LOADING_TIME = 2000; // 최소 2초 로딩 표시

    try {
      // 유통기한 추정 API 호출
      const response = await estimateExpiryDate({
        name: ingredient.name.trim(),
        category: ingredient.category,
        purchased_at: new Date(ingredient.addedDate).toISOString(),
      });

      // 응답으로 받은 추정 유통기한을 소비기한 마감 날짜에 업데이트
      // ISO 8601 형식의 날짜를 YYYY-MM-DD 형식으로 변환
      const estimatedDate = new Date(response.estimated_expiration_date);
      const formattedDate = estimatedDate.toISOString().split("T")[0];
      
      handleUpdateField(ingredientId, "expirationDate", formattedDate);
      
      // 최소 로딩 시간 보장
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_LOADING_TIME) {
        await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
      }
      
      setAiLoadingIngredientId(null);
    } catch (error: any) {
      // 에러 발생 시에도 최소 로딩 시간 보장
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_LOADING_TIME) {
        await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
      }
      
      setAiLoadingIngredientId(null);
      console.error("유통기한 추정 실패:", error);
      Alert.alert(
        "추정 실패",
        error?.message || "유통기한 추정 중 문제가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  const handleSubmit = async () => {
    try {
      // 여러 재료를 각각 /materials/manual 로 전송
      const results = await Promise.all(
        ingredients.map((item) =>
          createMaterialManual({
            name: item.name,
            category: item.category || undefined,
            // 백엔드 스키마는 ISO 문자열을 기대하므로 Date 객체로 변환 후 toISOString 사용
            purchased_at: new Date(item.addedDate).toISOString(),
            expired_at: new Date(item.expirationDate).toISOString(),
            quantity: item.quantity,
            // 현재 UI에 가격/통화 입력이 없어서 기본값으로 전송
            price: 0,
            currency: "KRW",
            // TODO: 실제 로그인 연동 시, 현재 로그인한 사용자의 id(string)로 교체
            user_id: "1",
            quantity_unit: "개",
          })
        )
      );

      console.log("Created materials:", results);

      // 폼 초기화
      setIngredients([
        {
          id: "1",
          name: "",
          quantity: 1,
          category: "",
          addedDate: today,
          expirationDate: today,
        },
      ]);

      // 홈탭으로 이동 (재료 리스트 탭이 index 라고 가정)
      Alert.alert("등록 완료", "재료가 성공적으로 등록되었습니다.", [
        {
          text: "OK",
          onPress: () => {
            router.push("/(tabs)");
          },
        },
      ]);
    } catch (error: any) {
      console.error("직접 입력 등록 실패:", error);
      Alert.alert(
        "등록 실패",
        error?.message || "재료 등록 중 문제가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  const ingredientCount = ingredients.length;
  const submitButtonLabel = `재료 추가하기 ${ingredientCount}개`;

  // 모든 재료의 이름과 카테고리가 입력되었는지 확인
  const isFormValid = React.useMemo(() => {
    return ingredients.every(
      (ingredient) => ingredient.name.trim() !== "" && ingredient.category !== ""
    );
  }, [ingredients]);

  const categories = INGREDIENT_CATEGORY_OPTIONS.filter(
    (cat) => cat.value !== "all" && cat.value !== "기타"
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {ingredients.map((ingredient) => (
          <View key={ingredient.id} style={styles.ingredientContainer}>
            <Pressable
              onPress={() => handleRemoveContainer(ingredient.id)}
              style={styles.removeButton}
              hitSlop={8}
            >
              <CloseIcon width={20} height={20} color="#FFAE2C" />
            </Pressable>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="재료 이름"
                placeholderTextColor="#999999"
                value={ingredient.name}
                onChangeText={(text) =>
                  handleUpdateField(ingredient.id, "name", text)
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.rowInputs}>
                <View style={styles.quantityInput}>
                  <QuantityControl
                    value={ingredient.quantity}
                    onChange={(newValue) => handleQuantityChange(ingredient.id, newValue)}
                    min={1}
                  />
                </View>
                <View style={styles.categoryInput}>
                  <Pressable
                    style={styles.inputWithIcon}
                    onPress={() => toggleCategoryDropdown(ingredient.id)}
                  >
                    <Text
                      style={[
                        styles.inputText,
                        !ingredient.category && styles.placeholderText,
                      ]}
                    >
                      {ingredient.category
                        ? INGREDIENT_CATEGORY_LABELS[ingredient.category] ?? ingredient.category
                        : "카테고리"}
                    </Text>
                    <ArrowIcon width={16} height={16} color="#999999" />
                  </Pressable>

                  {categoryDropdownVisible[ingredient.id] && (
                    <ScrollView
                      style={styles.categoryDropdown}
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={true}
                    >
                      {categories.map((cat) => (
                        <Pressable
                          key={cat.value}
                          style={styles.categoryItem}
                          onPress={() =>
                            handleSelectCategory(ingredient.id, cat.value)
                          }
                        >
                          <Text style={styles.categoryText}>{cat.label}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputWithIcon}>
                <Text style={styles.inputLabel}>추가된 날짜</Text>
                <Pressable
                  style={styles.datePickerButton}
                  onPress={() =>
                    setDatePickerVisible({
                      ingredientId: ingredient.id,
                      field: "addedDate",
                    })
                  }
                >
                  <Text style={styles.dateText}>
                    {formatDate(new Date(ingredient.addedDate))}
                  </Text>
                  <CalendarIcon width={20} height={20} color="#999999" />
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputWithIcon}>
                <Text style={styles.inputLabel}>소비기한 마감</Text>
                <Pressable
                  style={styles.datePickerButton}
                  onPress={() =>
                    setDatePickerVisible({
                      ingredientId: ingredient.id,
                      field: "expirationDate",
                    })
                  }
                >
                  <Text style={styles.dateText}>
                    {formatDate(new Date(ingredient.expirationDate))}
                  </Text>
                  <CalendarIcon width={20} height={20} color="#999999" />
                </Pressable>
              </View>
              <View style={styles.durationButtons}>
                <Pressable
                  style={styles.durationButton}
                  onPress={() => handleAddDuration(ingredient.id, "day")}
                >
                  <Text style={styles.durationButtonText}>+ 1D</Text>
                </Pressable>
                <Pressable
                  style={styles.durationButton}
                  onPress={() => handleAddDuration(ingredient.id, "week")}
                >
                  <Text style={styles.durationButtonText}>+ 1W</Text>
                </Pressable>
                <Pressable
                  style={styles.durationButton}
                  onPress={() => handleAddDuration(ingredient.id, "month")}
                >
                  <Text style={styles.durationButtonText}>+ 1M</Text>
                </Pressable>
                <Pressable 
                  style={styles.aiButton}
                  onPress={() => handleAIClick(ingredient.id)}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.aiButtonGradient}
                  >
                    <Text style={styles.aiIcon}>✨</Text>
                    <Text style={styles.aiText}>AI</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton
          label={submitButtonLabel}
          onPress={handleSubmit}
          disabled={!isFormValid}
        />
      </View>

      {datePickerVisible && (
        <DatePickerModal
          visible={true}
          onClose={() => setDatePickerVisible(null)}
          onSelectDate={handleSelectDate}
          initialDate={
            datePickerVisible
              ? ingredients.find(
                  (i) => i.id === datePickerVisible.ingredientId
                )?.[datePickerVisible.field] || today
              : today
          }
        />
      )}

      {aiLoadingIngredientId && (
        <AILoadingModal
          visible={true}
          onClose={() => setAiLoadingIngredientId(null)}
        />
      )}
    </SafeAreaView>
  );
}

// AI 로딩 모달 컴포넌트
function AILoadingModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const pulseValue = React.useRef(new Animated.Value(1)).current;
  const pingValue1 = React.useRef(new Animated.Value(0)).current;
  const pingValue2 = React.useRef(new Animated.Value(0)).current;
  const bounceValue1 = React.useRef(new Animated.Value(0)).current;
  const bounceValue2 = React.useRef(new Animated.Value(0)).current;
  const bounceValue3 = React.useRef(new Animated.Value(0)).current;
  const fadeValue = React.useRef(new Animated.Value(0)).current;
  const scaleValue = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    if (visible) {
      // 페이드 인 및 스케일 인
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // 회전 애니메이션 (3초 주기)
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();

      // 펄스 애니메이션
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // 펄스 효과 1
      Animated.loop(
        Animated.sequence([
          Animated.timing(pingValue1, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pingValue1, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // 펄스 효과 2 (0.5초 지연)
      Animated.loop(
        Animated.sequence([
          Animated.delay(500),
          Animated.timing(pingValue2, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pingValue2, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // 바운스 애니메이션 (점들)
      const createBounce = (value: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(value, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        );
      };

      createBounce(bounceValue1, 0).start();
      createBounce(bounceValue2, 200).start();
      createBounce(bounceValue3, 400).start();
    } else {
      // 리셋
      spinValue.setValue(0);
      pulseValue.setValue(1);
      pingValue1.setValue(0);
      pingValue2.setValue(0);
      bounceValue1.setValue(0);
      bounceValue2.setValue(0);
      bounceValue3.setValue(0);
      fadeValue.setValue(0);
      scaleValue.setValue(0.9);
    }
  }, [visible]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ping1Opacity = pingValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0],
  });

  const ping1Scale = pingValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const ping2Opacity = pingValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0],
  });

  const ping2Scale = pingValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const bounce1TranslateY = bounceValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const bounce2TranslateY = bounceValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const bounce3TranslateY = bounceValue3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.loadingBackdrop}>
        <Animated.View
          style={[
            styles.loadingModal,
            {
              opacity: fadeValue,
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          <View style={styles.loadingContent}>
            {/* 메인 스파크 애니메이션 */}
            <View style={styles.sparkContainer}>
              {/* 중앙 스파크 아이콘 */}
              <View style={styles.sparkIconContainer}>
                <Animated.Text
                  style={[
                    styles.sparkIcon,
                    {
                      transform: [{ scale: pulseValue }],
                    },
                  ]}
                >
                  ✨
                </Animated.Text>
              </View>

              {/* 오로라 펄스 효과 */}
              <Animated.View
                style={[
                  styles.pingCircle1,
                  {
                    opacity: ping1Opacity,
                    transform: [{ scale: ping1Scale }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.pingCircle2,
                  {
                    opacity: ping2Opacity,
                    transform: [{ scale: ping2Scale }],
                  },
                ]}
              />
            </View>

            {/* 텍스트 */}
            <Text style={styles.loadingTitle}>AI 분석중</Text>
            <Text style={styles.loadingDescription}>
              재료의 유통기한을{'\n'}추정하고 있어요
            </Text>

            {/* 움직이는 점들 */}
            <View style={styles.bounceDots}>
              <Animated.View
                style={[
                  styles.bounceDot,
                  styles.bounceDot1,
                  {
                    transform: [{ translateY: bounce1TranslateY }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.bounceDot,
                  styles.bounceDot2,
                  {
                    transform: [{ translateY: bounce2TranslateY }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.bounceDot,
                  styles.bounceDot3,
                  {
                    transform: [{ translateY: bounce3TranslateY }],
                  },
                ]}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerAddButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  ingredientContainer: {
    backgroundColor: "#FFF8E7",
    borderWidth: 2,
    borderColor: "#FFE5B8",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingBottom: 10,
    paddingTop: 44,
    marginBottom: 16,
    position: "relative",
  },
  inputGroup: {
    marginBottom: 14,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  quantityInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInput: {
    flex: 1,
    position: 'relative',
  },
  aiButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  aiButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  aiIcon: {
    fontSize: 13,
  },
  aiText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
    color: "#111111",
    fontWeight: "500",
  },
  inputWithIcon: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: {
    fontSize: 15,
    color: "#111111",
    fontWeight: "500",
  },
  placeholderText: {
    color: "#999999",
  },
  inputLabel: {
    fontSize: 15,
    color: "#999999",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 15,
    color: "#999999",
  },
  durationButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  durationButton: {
    paddingHorizontal: 16,
    backgroundColor: "#FFE5B8",
    //borderWidth: 1,
    borderColor: "#FFAE2C",
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: "center",
  },
  durationButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFAE2C",
  },
  removeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  footer: {
    paddingHorizontal: 24,
    //paddingBottom: 24,
    paddingTop: 24,
  },
  categoryDropdown: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 4,
    maxHeight: 160,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  categoryText: {
    fontSize: 15,
    color: "#111111",
  },
  loadingBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 44,
  },
  loadingModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 42,
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    position: 'relative',
  },
  loadingContent: {
    alignItems: 'center',
  },
  sparkContainer: {
    width: 128,
    height: 128,
    marginBottom: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotatingCircle: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  rotatingGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 64,
  },
  rotatingCircleInner: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#FFFFFF',
  },
  sparkIconContainer: {
    position: 'absolute',
    width: 128,
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkIcon: {
    fontSize: 48,
  },
  pingCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#818cf8',
  },
  pingCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#a78bfa',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  loadingDescription: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  bounceDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  bounceDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  bounceDot1: {
    backgroundColor: '#667eea',
  },
  bounceDot2: {
    backgroundColor: '#6f5dd3',
  },
  bounceDot3: {
    backgroundColor: '#764ba2',
  },
});
