import { create } from 'zustand'
import { SubmitType } from '@/constants'

const useStore = create((set) => ({
    submitType: SubmitType.START,
    updateSubmitType: (newSubmitType: SubmitType) => set({ submitType: newSubmitType }),
}))

export default useStore