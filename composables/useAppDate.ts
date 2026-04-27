// composables/useAppDate.ts
export const useAppDate = () => {
  //THIS FOR TESTING !!!!!!!!!
  //Empty string "" to use real time.
  const TEST_DATE = "2025-07-02" 

  const date = computed(() => {
    return TEST_DATE ? new Date(TEST_DATE) : new Date()
  })

  const currentDate = computed(() => {
    return date.value.toISOString().split('T')[0]
  })

  return {
    date,
    currentDate // YYYY-MM-DD format
  }
}