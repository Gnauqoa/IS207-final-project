export { default as InlineEditor } from "./InlineEditor";
export enum EditorType {
  edit = "edit",
  new = "new",
}
export type EditorProps = {
	onClose?: () => void
	onSubmit?: (title: string) => void
	onSuccess?: (data?: any) => void
	onError?: () => void
	placeholder?: string
	defaultValue?: string
	id?: string
	parentId?: string
	editorType: EditorType
}