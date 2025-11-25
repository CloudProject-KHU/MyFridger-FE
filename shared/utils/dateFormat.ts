/**
 * 날짜를 "YYYY년 MM월 DD일" 형식으로 포맷팅합니다.
 * @param date - 포맷팅할 Date 객체
 * @returns "2025년 11월 24일" 형식의 문자열
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * ISO 날짜 문자열을 Date 객체로 파싱합니다.
 * @param dateString - ISO 형식의 날짜 문자열 (예: "2025-11-24")
 * @returns Date 객체
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * 오늘 날짜를 ISO 형식 문자열로 반환합니다.
 * @returns "YYYY-MM-DD" 형식의 문자열
 */
export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}
