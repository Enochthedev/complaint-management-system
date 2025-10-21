export type ComplaintType = 
  | 'missing_grade'
  | 'result_error'
  | 'course_registration'
  | 'academic_record'
  | 'other'

export type ComplaintStatus = 
  | 'pending'
  | 'under_review'
  | 'resolved'
  | 'rejected'

export type UserRole = 'student' | 'admin' | 'super_admin'

export interface Profile {
  id: string
  user_id: string
  matric_number: string
  full_name: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Complaint {
  id: string
  complaint_id: string
  student_id: string
  complaint_type: ComplaintType
  course_code: string
  course_title: string
  session: string
  semester: string
  level: number
  description: string
  status: ComplaintStatus
  resolved_at?: string
  created_at: string
  updated_at: string
}

export interface ComplaintAttachment {
  id: string
  complaint_id: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  uploaded_at: string
}

export interface Response {
  id: string
  complaint_id: string
  admin_id: string
  response_text: string
  is_internal: boolean
  created_at: string
}