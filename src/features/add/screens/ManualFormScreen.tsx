import React from "react";
import {
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
import ChevronLeft from "@/assets/images/chevron-left.svg";
import ChevronRight from "@/assets/images/chevron-right.svg";
import CloseIcon from "@/assets/images/close.svg";
import CalendarIcon from "@/assets/images/Frame.svg";
import ActionButton from "@shared/components/buttons/ActionButton";
import { INGREDIENT_CATEGORY_OPTIONS } from "@shared/constants/ingredientCategories";

type IngredientFormData = {
  id: string;
  name: string;
  category: string;
  addedDate: string;
  expirationDate: string;
};

export default function ManualFormScreen() {
  const today = new Date().toISOString().split("T")[0];
  const formattedToday = formatDate(new Date());

  const [ingredients, setIngredients] = React.useState<IngredientFormData[]>([
    {
      id: "1",
      name: "",
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

  const toggleCategoryDropdown = (ingredientId: string) => {
    setCategoryDropdownVisible((prev) => ({
      ...prev,
      [ingredientId]: !prev[ingredientId],
    }));
  };

  const handleAddContainer = () => {
    const newIngredient: IngredientFormData = {
      id: Date.now().toString(),
      name: "",
      category: "",
      addedDate: today,
      expirationDate: today,
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const handleRemoveContainer = (id: string) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const handleUpdateField = (
    id: string,
    field: keyof IngredientFormData,
    value: string
  ) => {
    setIngredients(
      ingredients.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSelectCategory = (ingredientId: string, category: string) => {
    handleUpdateField(ingredientId, "category", category);
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

  const handleSubmit = () => {
    console.log("Submit ingredients:", ingredients);
  };

  const ingredientCount = ingredients.length;
  const submitButtonLabel = `재료 추가하기 ${ingredientCount}개`;

  const categories = INGREDIENT_CATEGORY_OPTIONS.filter(
    (cat) => cat.value !== "all" && cat.value !== "기타"
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <View style={styles.header}>
        <ActionButton
          label="재료 추가"
          onPress={handleAddContainer}
          style={styles.addButton}
          labelStyle={styles.addButtonLabel}
        />
      </View>

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
              <CloseIcon width={20} height={20} />
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
                  {ingredient.category || "카테고리"}
                </Text>
                <ArrowIcon width={16} height={16} color="#999999" />
              </Pressable>

              {categoryDropdownVisible[ingredient.id] && (
                <View style={styles.categoryDropdown}>
                  {categories.map((cat) => (
                    <Pressable
                      key={cat.value}
                      style={styles.categoryItem}
                      onPress={() =>
                        handleSelectCategory(ingredient.id, cat.label)
                      }
                    >
                      <Text style={styles.categoryText}>{cat.label}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
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
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton
          label={submitButtonLabel}
          onPress={handleSubmit}
          style={styles.submitButton}
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
    </SafeAreaView>
  );
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}년 ${month}월 ${day}일`;
}

type DatePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  initialDate: string;
};

function DatePickerModal({
  visible,
  onClose,
  onSelectDate,
  initialDate,
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = React.useState(new Date(initialDate));

  const handleConfirm = () => {
    onSelectDate(selectedDate.toISOString().split("T")[0]);
    onClose();
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setSelectedDate(newDate);
  };

  const selectDay = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const selectedDay = selectedDate.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={styles.calendarModal}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.calendarHeader}>
            <Pressable onPress={() => changeMonth(-1)} hitSlop={8}>
              <ChevronLeft width={24} height={24} color="#999999" />
            </Pressable>
            <Text style={styles.calendarTitle}>
              {year}년 {month + 1}월
            </Text>
            <Pressable onPress={() => changeMonth(1)} hitSlop={8}>
              <ChevronRight width={24} height={24} color="#999999" />
            </Pressable>
          </View>

          <View style={styles.weekDays}>
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <Text key={day} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((day, index) => (
              <Pressable
                key={index}
                style={[
                  styles.dayCell,
                  day === selectedDay && styles.selectedDayCell,
                ]}
                onPress={() => day && selectDay(day)}
                disabled={!day}
              >
                {day && (
                  <Text
                    style={[
                      styles.dayText,
                      day === selectedDay && styles.selectedDayText,
                    ]}
                  >
                    {day}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>

          <View style={styles.calendarFooter}>
            <Pressable style={styles.calendarButton} onPress={onClose}>
              <Text style={styles.calendarButtonText}>취소</Text>
            </Pressable>
            <Pressable style={styles.calendarButton} onPress={handleConfirm}>
              <Text style={styles.calendarButtonText}>확인</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  addButton: {
    backgroundColor: "#EEEEEE",
    marginBottom: 14,
  },
  addButtonLabel: {
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 16,
  },
  ingredientContainer: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 16,
    paddingTop: 36,
    marginBottom: 12,
    position: "relative",
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111111",
  },
  inputWithIcon: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: {
    fontSize: 15,
    color: "#111111",
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
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 16,
    paddingTop: 8,
  },
  submitButton: {
    backgroundColor: "#D9D9D9",
    marginBottom: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryDropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 4,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  categoryText: {
    fontSize: 15,
    color: "#111111",
  },
  calendarModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: 320,
    maxHeight: 500,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555555",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekDayText: {
    width: 40,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 20,
  },
  selectedDayCell: {
    backgroundColor: "#D9D9D9",
  },
  dayText: {
    fontSize: 15,
    color: "#999999",
  },
  selectedDayText: {
    fontWeight: "600",
    color: "#111111",
  },
  calendarFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    gap: 12,
  },
  calendarButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    alignItems: "center",
  },
  calendarButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666666",
  },
});
