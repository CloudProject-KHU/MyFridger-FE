import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ChevronLeft from "@/assets/images/icons/chevron-left.svg";
import ChevronRight from "@/assets/images/icons/chevron-right.svg";

export type DatePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  initialDate: string;
};

export default function DatePickerModal({
  visible,
  onClose,
  onSelectDate,
  initialDate,
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = React.useState(new Date(initialDate));

  React.useEffect(() => {
    if (visible) {
      setSelectedDate(new Date(initialDate));
    }
  }, [visible, initialDate]);

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
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
