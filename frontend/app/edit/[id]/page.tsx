import EditPropertyClient from './EditPropertyClient'

export default async function EditProperty({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return <EditPropertyClient id={id} />
}