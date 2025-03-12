'use client'

import { useState } from 'react'
import {
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Box,
  useTheme,
  Tooltip
} from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'

// Styled Components
const PromptCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(135deg, #f6f7fe 0%, #ffffff 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)'
  }
}))

const ResponseCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)'
  }
}))

const AnalysisHistory = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  overflowY: 'auto',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius * 2
}))

const HistoryItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: '#ffffff',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)'
  },
  '&:last-child': {
    marginBottom: 0
  }
}))

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: '8px 20px',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)'
  }
}))

const ResultBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  fontFamily: 'monospace',
  fontSize: '0.9rem',
  lineHeight: '1.5',
  whiteSpace: 'pre-wrap',
  maxHeight: '400px',
  overflowY: 'auto',
  border: '1px solid',
  borderColor: theme.palette.divider,
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.paper,
    borderRadius: '4px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.primary.dark
    }
  }
}))

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& i': {
    fontSize: '1.2rem'
  }
}))

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  '& h5': {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2)
  },
  '& p': {
    color: theme.palette.text.secondary
  }
}))

const SuggestionChip = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: '20px',
  textTransform: 'none',
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main
  }
}))

// Mock data for charts
const assetStatusData = [
  { name: 'Active', value: 135 },
  { name: 'Under Maintenance', value: 10 },
  { name: 'Pending Transfer', value: 5 }
]

const utilizationData = [
  { name: 'Ovens', value: 85 },
  { name: 'Refrigerators', value: 95 },
  { name: 'Prep Stations', value: 70 },
  { name: 'Storage Units', value: 60 },
  { name: 'Dishwashers', value: 75 }
]

const maintenanceCostData = [
  { month: 'Jan', cost: 2500 },
  { month: 'Feb', cost: 2300 },
  { month: 'Mar', cost: 2800 },
  { month: 'Apr', cost: 2400 },
  { month: 'May', cost: 2100 },
  { month: 'Jun', cost: 2600 }
]

const promptSuggestions = [
  {
    text: "Show asset status overview",
    icon: "ri-pie-chart-line",
    description: "View distribution of asset statuses"
  },
  {
    text: "Analyze equipment utilization",
    icon: "ri-bar-chart-line",
    description: "See usage rates of different equipment"
  },
  {
    text: "Show maintenance cost trends",
    icon: "ri-line-chart-line",
    description: "View monthly maintenance expenses"
  },
  {
    text: "Kitchen equipment performance",
    icon: "ri-restaurant-line",
    description: "Analyze kitchen asset efficiency"
  },
  {
    text: "Compare department utilization",
    icon: "ri-building-line",
    description: "Compare asset usage across departments"
  },
  {
    text: "Identify maintenance priorities",
    icon: "ri-tools-line",
    description: "Find equipment needing attention"
  }
]

interface AnalysisResult {
  type: 'text' | 'pieChart' | 'barChart' | 'lineChart'
  title: string
  description: string
  data?: any
}

// Mock function for AI analysis - Replace with actual API call
const performAIAnalysis = async (prompt: string): Promise<AnalysisResult[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const promptLower = prompt.toLowerCase()
  
  if (promptLower.includes('status') || promptLower.includes('overview')) {
    return [
      {
        type: 'text',
        title: 'Asset Status Overview',
        description: `Current Asset Status:\n- Total Assets: 150\n- Active: 135\n- Under Maintenance: 10\n- Pending Transfer: 5`
      },
      {
        type: 'pieChart',
        title: 'Asset Status Distribution',
        description: 'Visual breakdown of current asset status',
        data: assetStatusData
      }
    ]
  }
  
  if (promptLower.includes('utilization')) {
    return [
      {
        type: 'text',
        title: 'Equipment Utilization Analysis',
        description: 'Analysis of kitchen equipment usage shows varying utilization rates across different equipment types.'
      },
      {
        type: 'barChart',
        title: 'Equipment Utilization Rates',
        description: 'Percentage utilization of different equipment types',
        data: utilizationData
      }
    ]
  }
  
  if (promptLower.includes('maintenance') || promptLower.includes('cost')) {
    return [
      {
        type: 'text',
        title: 'Maintenance Cost Analysis',
        description: 'Six-month maintenance cost trend shows fluctuating expenses with an average of $2,450 per month.'
      },
      {
        type: 'lineChart',
        title: 'Maintenance Cost Trend',
        description: 'Monthly maintenance costs over the past 6 months',
        data: maintenanceCostData
      }
    ]
  }
  
  return [
    {
      type: 'text',
      title: 'General Analysis',
      description: 'Please ask specific questions about asset status, utilization, or maintenance costs for detailed analysis with visualizations.'
    }
  ]
}

const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d0ed57']

const ResultSection = ({ result }: { result: AnalysisResult }) => {
  const theme = useTheme()

  switch (result.type) {
    case 'pieChart':
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{result.title}</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>{result.description}</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={result.data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {result.data.map((entry: any, index: number) => (
                  <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )

    case 'barChart':
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{result.title}</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>{result.description}</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={result.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="value" name="Utilization %" fill="#8884d8">
                {result.data.map((entry: any, index: number) => (
                  <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )

    case 'lineChart':
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{result.title}</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>{result.description}</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={result.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cost"
                name="Cost ($)"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )

    default:
      return (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{result.title}</Typography>
          <Typography
            component="pre"
            sx={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              backgroundColor: theme.palette.background.default,
              p: 2,
              borderRadius: 1
            }}
          >
            {result.description}
          </Typography>
        </Box>
      )
  }
}

interface HistoryEntry {
  id: string
  timestamp: string
  prompt: string
  response: string
}

const AIAnalysisPage = () => {
  const [prompt, setPrompt] = useState('Give me an overview of our current asset status')
  const [loading, setLoading] = useState(false)
  const [currentResponse, setCurrentResponse] = useState<AnalysisResult[]>([
    {
      type: 'text',
      title: 'Initial Asset Overview',
      description: `Current Asset Status:\n- Total Assets: 150\n- Active: 135\n- Under Maintenance: 10\n- Pending Transfer: 5`
    },
    {
      type: 'pieChart',
      title: 'Asset Status Distribution',
      description: 'Visual breakdown of current asset status',
      data: assetStatusData
    }
  ])
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: '1',
      timestamp: '2025-02-25 16:45',
      prompt: 'Show me the maintenance status of kitchen equipment',
      response: `Based on the analysis of maintenance records:\n\n` +
               `1. Equipment Reliability:\n` +
               `   - 85% of kitchen equipment is operating at optimal efficiency\n` +
               `   - 15% requires preventive maintenance within next 30 days\n\n` +
               `2. Cost Analysis:\n` +
               `   - Maintenance costs are 12% lower than industry average\n` +
               `   - Preventive maintenance has reduced emergency repairs by 30%\n\n` +
               `3. Recommendations:\n` +
               `   - Schedule maintenance for 3 pizza ovens next week\n` +
               `   - Consider upgrading refrigeration units in next 6 months`
    },
    {
      id: '2',
      timestamp: '2025-02-25 16:40',
      prompt: 'Analyze asset utilization in main kitchen',
      response: `Asset Utilization Analysis:\n\n` +
               `1. Kitchen Equipment Usage:\n` +
               `   - Ovens: 85% utilization during peak hours\n` +
               `   - Refrigerators: 95% capacity utilization\n` +
               `   - Prep stations: 70% average utilization\n\n` +
               `2. Optimization Opportunities:\n` +
               `   - Redistribute prep station workload\n` +
               `   - Add additional cold storage in next quarter\n\n` +
               `3. Cost Savings Potential:\n` +
               `   - Estimated 15% efficiency gain through redistribution\n` +
               `   - ROI of 125% for cold storage expansion`
    }
  ])

  const handleAnalysis = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const response = await performAIAnalysis(prompt)
      setCurrentResponse(response)
      
      // Add to history
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        prompt,
        response: response.map(r => `${r.title}\n${r.description}`).join('\n\n')
      }
      setHistory([newEntry, ...history])
    } catch (error) {
      console.error('Analysis failed:', error)
      setCurrentResponse([{
        type: 'text',
        title: 'Error',
        description: 'Analysis failed. Please try again.'
      }])
    }
    setLoading(false)
  }

  const handleDownload = (entry: HistoryEntry) => {
    const content = `AI Analysis Report\n\nDate: ${entry.timestamp}\n\nPrompt: ${entry.prompt}\n\nAnalysis:\n${entry.response}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-analysis-${entry.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDeleteHistory = (id: string) => {
    setHistory(history.filter(entry => entry.id !== id))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader>
          <Typography variant='h5'>AI Asset Analysis</Typography>
          <Typography>Get instant insights about your restaurant assets using AI-powered analysis</Typography>
        </PageHeader>
      </Grid>

      <Grid item xs={12}>
        <PromptCard>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant='h6' sx={{ mb: 2 }}>Analysis Prompt</Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Ask questions about asset maintenance, utilization, or performance metrics
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Try asking about asset status, utilization rates, or maintenance costs..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              sx={{ mb: 4, flex: 1 }}
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                <i className="ri-lightbulb-line" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Suggested Prompts
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {promptSuggestions.map((suggestion, index) => (
                  <Tooltip
                    key={index}
                    title={suggestion.description}
                    placement="top"
                  >
                    <SuggestionChip
                      size="small"
                      onClick={() => setPrompt(suggestion.text)}
                      startIcon={<i className={suggestion.icon} />}
                    >
                      {suggestion.text}
                    </SuggestionChip>
                  </Tooltip>
                ))}
              </Box>
            </Box>
            
            <StyledButton
              fullWidth
              variant='contained'
              endIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <IconWrapper>
                    <i className='ri-send-plane-line' />
                  </IconWrapper>
                )
              }
              onClick={handleAnalysis}
              disabled={loading || !prompt.trim()}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </StyledButton>
          </CardContent>
        </PromptCard>
      </Grid>

      <Grid item xs={12}>
        <ResponseCard>
          <CardContent sx={{ height: '100%' }}>
            <Typography variant='h6' sx={{ mb: 2 }}>Analysis Results</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              AI-generated insights based on your query
            </Typography>
            
            {currentResponse.length > 0 ? (
              <Box>
                {currentResponse.map((result, index) => (
                  <ResultSection key={index} result={result} />
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <i className='ri-robot-line' style={{ fontSize: '48px', color: 'text.disabled', marginBottom: '16px' }} />
                <Typography color="text.secondary">
                  Enter a prompt and click Analyze to get insights about your assets
                </Typography>
              </Box>
            )}
          </CardContent>
        </ResponseCard>
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 3 }}>Analysis History</Typography>
        <AnalysisHistory>
          {history.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <i className='ri-history-line' style={{ fontSize: '48px', color: 'text.disabled', marginBottom: '16px' }} />
              <Typography color="text.secondary">
                No analysis history yet
              </Typography>
            </Box>
          ) : (
            history.map(entry => (
              <HistoryItem key={entry.id} elevation={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='ri-time-line' style={{ color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {entry.timestamp}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <StyledButton
                      size="small"
                      variant="outlined"
                      startIcon={<i className='ri-download-line' />}
                      onClick={() => handleDownload(entry)}
                    >
                      Download
                    </StyledButton>
                    <StyledButton
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<i className='ri-delete-bin-line' />}
                      onClick={() => handleDeleteHistory(entry.id)}
                    >
                      Delete
                    </StyledButton>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='ri-questionnaire-line' />
                    Prompt
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{entry.prompt}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='ri-robot-line' />
                    Analysis
                  </Typography>
                  <ResultBox>
                    {entry.response}
                  </ResultBox>
                </Box>
              </HistoryItem>
            ))
          )}
        </AnalysisHistory>
      </Grid>
    </Grid>
  )
}

export default AIAnalysisPage
