import { useState } from 'react'
import { View } from 'react-native'
import { AppHeader, Button, LogTab, NewEntrySheet, ProgressTab, Row, SavedTab, Screen, Tabs, Text, Toast } from '@/ui/components'
import { useLoad } from '@/ui/hooks/useLoad'
import { useToast } from '@/ui/hooks/useToast'
import { api } from '@/api'
import { entryFromForm, journalOverview, validateEntryForm } from '@/domain/journal'
import { rankOfUser } from '@/domain/ranking'
import { space } from '@/ui/theme'

// What the Journal needs: API calls + domain derivations. Module-level = stable for useLoad.
async function loadJournal() {
  const [entries, saved, todayWorkout, me, progress] = await Promise.all([
    api.journal.list(), api.saved.list(), api.plans.today(), api.me.get(), api.journal.progress(),
  ])
  return {
    ...journalOverview(entries, new Date()),
    saved, todayWorkout, goals: me.goals, rank: rankOfUser(me), exerciseProgress: progress,
  }
}

// Thin screen: UI-only state (tab, sheet) + wiring user actions to the API.
export default function JournalScreen() {
  const { data, reload } = useLoad(loadJournal)
  const [tab, setTab] = useState('log')
  const [sheetDate, setSheetDate] = useState(null) // null = closed
  const [toast, showToast] = useToast()

  if (!data) return <Screen><AppHeader /></Screen>

  const openSheet = (date = data.todayKey) => setSheetDate(date)

  async function addEntry(form) {
    const errors = validateEntryForm(form)
    if (Object.keys(errors).length) return { errors }
    await api.journal.create(entryFromForm(form))
    setSheetDate(null)
    showToast('Entry saved 💪')
    reload()
  }

  async function removeSaved(id) {
    await api.saved.remove(id)
    showToast('Removed from saved')
    reload()
  }

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <AppHeader />
        <Row gap={4} align="flex-end" justify="space-between" wrap>
          <View style={{ flexShrink: 1 }}>
            <Text variant="h1">Training journal</Text>
            <Text variant="muted" style={{ marginTop: space[1] }}>Your story, one session at a time.</Text>
          </View>
          <Button onPress={() => openSheet()}>+ New entry</Button>
        </Row>

        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[{ id: 'log', label: 'Log' }, { id: 'progress', label: 'Progress' }, { id: 'saved', label: `Saved · ${data.saved.length}` }]}
        />

        {tab === 'log' && <LogTab data={data} onNewEntry={openSheet} />}
        {tab === 'progress' && <ProgressTab data={data} />}
        {tab === 'saved' && <SavedTab saved={data.saved} onRemove={removeSaved} />}
      </Screen>

      {sheetDate && (
        <NewEntrySheet key={sheetDate} visible date={sheetDate} onClose={() => setSheetDate(null)} onSave={addEntry} />
      )}
      <Toast message={toast} />
    </View>
  )
}
