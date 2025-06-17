export interface LessonItem {
    id: number,
    course_id: number,
    title: string
    video_url: string
    content: string
    order_index: number
    create_at: Date
    banner: string
}

export interface LessonItemInsert {
    title: string
    content: string
    course_id: number
    video_url: string
    order_index: number
    banner: string
}
export interface LessonItemUpdate {
    id: number
    title: string
    content: string
    video_url: string
    banner: string
}