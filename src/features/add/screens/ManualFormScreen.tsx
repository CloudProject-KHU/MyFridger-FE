import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ActionButton from "@shared/components/buttons/ActionButton";
import SearchBar from "@shared/components/inputs/SearchBar";
import TagTabs from "@shared/components/tabs/TagTabs";
import { INGREDIENT_CATEGORY_OPTIONS } from "@shared/constants/ingredientCategories";

export default function ManualFormScreen() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState(
    INGREDIENT_CATEGORY_OPTIONS[0].value
  );

  const [selectedIngredients, setSelectedIngredients] = React.useState<
    string[]
  >([]);

  const handleAddIngredient = () => {};

  const selectedCount = selectedIngredients.length;
  const buttonLabel =
    selectedCount > 0
      ? `재료 추가하기 ${selectedCount}개`
      : "재료를 추가하세요";

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <View style={styles.container}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="재료를 검색하세요"
          containerStyle={styles.searchBar}
        />

        <TagTabs
          options={INGREDIENT_CATEGORY_OPTIONS}
          activeValue={activeCategory}
          onChange={setActiveCategory}
          containerStyle={styles.tabsContainer}
          contentStyle={styles.tabsContent}
          tabStyle={styles.tab}
          tabActiveStyle={styles.tabActive}
          tabLabelStyle={styles.tabLabel}
          tabLabelActiveStyle={styles.tabLabelActive}
        />
      </View>

      <ActionButton
        label={buttonLabel}
        tone={selectedCount === 0 ? "inactive" : "primary"}
        style={styles.actionButton}
        onPress={handleAddIngredient}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchBar: {
    marginTop: 8,
  },
  tabsContainer: {
    paddingVertical: 4,
  },
  tabsContent: {
    paddingHorizontal: 0,
  },
  tab: {
    backgroundColor: "#FFFFFF",
    borderColor: "#dbdbdb",
  },
  tabActive: {
    backgroundColor: "#DCDCDC",
    borderColor: "#DCDCDC",
  },
  tabLabel: {
    color: "#999999",
  },
  tabLabelActive: {
    color: "#111111",
  },
  actionButton: {
    marginHorizontal: 28,
    marginBottom: 20,
    marginTop: 16,
  },
});
