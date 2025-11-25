import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ArrowIcon from "@/assets/images/^.svg";
import CloseIcon from "@/assets/images/close.svg";
import CalendarIcon from "@/assets/images/Frame.svg";
import ActionButton from "@shared/components/buttons/ActionButton";
import DatePickerModal from "@shared/components/calendar/DatePickerModal";
import { INGREDIENT_CATEGORY_OPTIONS } from "@shared/constants/ingredientCategories";
import { formatDate } from "@shared/utils/dateFormat";

type IngredientFormData = {
  id: string;
  name: string;
  quantity: number;
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
      quantity: 1,
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
    value: string | number
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

  const handleQuantityChange = (ingredientId: string, delta: number) => {
    setIngredients(
      ingredients.map((item) =>
        item.id === ingredientId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
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
              <View style={styles.inputWithIcon}>
                <Text style={styles.inputLabel}>재료 개수</Text>
                <View style={styles.quantityControl}>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(ingredient.id, -1)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </Pressable>
                  <View style={styles.quantityBox}>
                    <Text style={styles.quantityText}>
                      {ingredient.quantity}
                    </Text>
                  </View>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(ingredient.id, 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>
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
                        handleSelectCategory(ingredient.id, cat.label)
                      }
                    >
                      <Text style={styles.categoryText}>{cat.label}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
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
              <View style={styles.durationButtons}>
                <Pressable
                  style={styles.durationButton}
                  onPress={() => handleAddDuration(ingredient.id, "day")}
                >
                  <Text style={styles.durationButtonText}>+Day 1</Text>
                </Pressable>
                <Pressable
                  style={styles.durationButton}
                  onPress={() => handleAddDuration(ingredient.id, "week")}
                >
                  <Text style={styles.durationButtonText}>+Week 1</Text>
                </Pressable>
                <Pressable
                  style={styles.durationButton}
                  onPress={() => handleAddDuration(ingredient.id, "month")}
                >
                  <Text style={styles.durationButtonText}>+Month 1</Text>
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
          labelStyle={styles.submitButtonLabel}
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
    borderRadius: 16,
    padding: 24,
    paddingTop: 44,
    marginBottom: 12,
    position: "relative",
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111111",
    fontWeight: "500",
  },
  inputWithIcon: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#666666",
    lineHeight: 18,
  },
  quantityBox: {
    minWidth: 40,
    height: 28,
    borderWidth: 1,
    backgroundColor: "#F9F9F9",
    borderColor: "#DDDDDD",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111111",
    textAlign: "center",
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
    gap: 20,
    marginTop: 22,
    justifyContent: "center",
  },
  durationButton: {
    paddingHorizontal: 16,
    backgroundColor: "#999999",
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: "center",
  },
  durationButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  removeButton: {
    position: "absolute",
    top: 12,
    right: 12,
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
  submitButtonLabel: {
    fontWeight: "500",
  },
  categoryDropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 4,
    maxHeight: 200,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  categoryText: {
    fontSize: 15,
    color: "#111111",
  },
});
