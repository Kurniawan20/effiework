'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'

// Third Party Imports
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import { EventClickArg, DateSelectArg } from '@fullcalendar/core'

// Custom Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Dummy Data
const maintenanceTypes = [
  { id: 1, name: 'Preventive Maintenance' },
  { id: 2, name: 'Corrective Maintenance' },
  { id: 3, name: 'Condition-Based Maintenance' },
  { id: 4, name: 'Predictive Maintenance' }
]

const assets = [
  { id: 1, name: 'Laptop Dell XPS 15' },
  { id: 2, name: 'HP LaserJet Printer' },
  { id: 3, name: 'Industrial AC Unit' },
  { id: 4, name: 'Toyota Camry' },
  { id: 5, name: 'Executive Desk' }
]

const technicians = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sarah Johnson' },
  { id: 3, name: 'Mike Brown' },
  { id: 4, name: 'Lisa Davis' }
]

// Initial Events
const initialEvents = [
  {
    id: '1',
    title: 'Laptop Maintenance',
    start: '2025-02-26T10:00:00',
    end: '2025-02-26T11:30:00',
    extendedProps: {
      type: 'Preventive Maintenance',
      asset: 'Laptop Dell XPS 15',
      technician: 'John Smith',
      description: 'Regular system checkup and cleaning'
    }
  },
  {
    id: '2',
    title: 'Printer Repair',
    start: '2025-02-27T14:00:00',
    end: '2025-02-27T16:00:00',
    extendedProps: {
      type: 'Corrective Maintenance',
      asset: 'HP LaserJet Printer',
      technician: 'Sarah Johnson',
      description: 'Fix paper jam issue and calibrate'
    }
  },
  {
    id: '3',
    title: 'AC Maintenance',
    start: '2025-02-28T09:00:00',
    end: '2025-02-28T12:00:00',
    extendedProps: {
      type: 'Preventive Maintenance',
      asset: 'Industrial AC Unit',
      technician: 'Mike Brown',
      description: 'Filter cleaning and performance check'
    }
  }
]

const MaintenanceSchedule = () => {
  // States
  const [events, setEvents] = useState(initialEvents)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: null,
    end: null,
    type: '',
    asset: '',
    technician: '',
    description: ''
  })

  // Handlers
  const handleEventClick = (arg: EventClickArg) => {
    setSelectedEvent(arg.event)
    setIsEventDialogOpen(true)
  }

  const handleDateSelect = (arg: DateSelectArg) => {
    setNewEvent({
      ...newEvent,
      start: arg.start,
      end: arg.end
    })
    setSelectedEvent(null)
    setIsEventDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsEventDialogOpen(false)
    setSelectedEvent(null)
    setNewEvent({
      title: '',
      start: null,
      end: null,
      type: '',
      asset: '',
      technician: '',
      description: ''
    })
  }

  const handleEventSave = () => {
    if (selectedEvent) {
      // Update existing event
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title: newEvent.title || selectedEvent.title,
              extendedProps: {
                type: newEvent.type || selectedEvent.extendedProps.type,
                asset: newEvent.asset || selectedEvent.extendedProps.asset,
                technician: newEvent.technician || selectedEvent.extendedProps.technician,
                description: newEvent.description || selectedEvent.extendedProps.description
              }
            }
          : event
      )
      setEvents(updatedEvents)
    } else {
      // Add new event
      setEvents([
        ...events,
        {
          id: String(events.length + 1),
          title: newEvent.title,
          start: newEvent.start,
          end: newEvent.end,
          extendedProps: {
            type: newEvent.type,
            asset: newEvent.asset,
            technician: newEvent.technician,
            description: newEvent.description
          }
        }
      ])
    }
    handleDialogClose()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Maintenance Schedule'
            action={
              <Button
                variant='contained'
                onClick={() => {
                  setSelectedEvent(null)
                  setIsEventDialogOpen(true)
                }}
              >
                Add Maintenance
              </Button>
            }
          />
          <CardContent>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView='dayGridMonth'
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
              }}
              events={events}
              editable
              selectable
              selectMirror
              dayMaxEvents
              weekends
              select={handleDateSelect}
              eventClick={handleEventClick}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Event Dialog */}
      <Dialog
        open={isEventDialogOpen}
        onClose={handleDialogClose}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          {selectedEvent ? 'Edit Maintenance Schedule' : 'Add Maintenance Schedule'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Title'
                defaultValue={selectedEvent?.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Grid>

            {/* Date Range */}
            <Grid item xs={12} sm={6}>
              <AppReactDatepicker
                selected={newEvent.start || selectedEvent?.start}
                onChange={(date) => setNewEvent({ ...newEvent, start: date })}
                showTimeSelect
                dateFormat='MMMM d, yyyy h:mm aa'
                customInput={
                  <TextField
                    fullWidth
                    label='Start Date & Time'
                  />
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppReactDatepicker
                selected={newEvent.end || selectedEvent?.end}
                onChange={(date) => setNewEvent({ ...newEvent, end: date })}
                showTimeSelect
                dateFormat='MMMM d, yyyy h:mm aa'
                customInput={
                  <TextField
                    fullWidth
                    label='End Date & Time'
                  />
                }
              />
            </Grid>

            {/* Maintenance Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Maintenance Type</InputLabel>
                <Select
                  label='Maintenance Type'
                  defaultValue={selectedEvent?.extendedProps?.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                >
                  {maintenanceTypes.map((type) => (
                    <MenuItem key={type.id} value={type.name}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Asset */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Asset</InputLabel>
                <Select
                  label='Asset'
                  defaultValue={selectedEvent?.extendedProps?.asset}
                  onChange={(e) => setNewEvent({ ...newEvent, asset: e.target.value })}
                >
                  {assets.map((asset) => (
                    <MenuItem key={asset.id} value={asset.name}>
                      {asset.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Technician */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Technician</InputLabel>
                <Select
                  label='Technician'
                  defaultValue={selectedEvent?.extendedProps?.technician}
                  onChange={(e) => setNewEvent({ ...newEvent, technician: e.target.value })}
                >
                  {technicians.map((tech) => (
                    <MenuItem key={tech.id} value={tech.name}>
                      {tech.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label='Description'
                defaultValue={selectedEvent?.extendedProps?.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant='contained' onClick={handleEventSave}>
            {selectedEvent ? 'Update' : 'Add'} Maintenance
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default MaintenanceSchedule
