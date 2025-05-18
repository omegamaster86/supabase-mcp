import { supabase } from '@/lib/supabase'

export default async function Instruments() {
  const { data: instruments, error } = await supabase
    .from('instruments')
    .select('*')

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">楽器一覧</h1>
      <div className="grid gap-4">
        {instruments?.map((instrument) => (
          <div key={instrument.id} className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold">{instrument.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}