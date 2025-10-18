"use client"

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Bell, Plus, Settings, Baby, Syringe, Clock, Navigation, Search, Filter, Newspaper, AlertTriangle, TrendingUp, Info, ExternalLink, CheckCircle, XCircle, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// Dados das vacinas do calendário brasileiro
const VACCINE_SCHEDULE = [
  { name: 'BCG', age: '0 meses', description: 'Tuberculose', urgent: false, category: 'Recém-nascido' },
  { name: 'Hepatite B', age: '0 meses', description: 'Hepatite B', urgent: false, category: 'Recém-nascido' },
  { name: 'Pentavalente', age: '2 meses', description: 'DTP + Hib + Hepatite B', urgent: true, category: 'Primeiras doses' },
  { name: 'VIP', age: '2 meses', description: 'Poliomielite inativada', urgent: true, category: 'Primeiras doses' },
  { name: 'Pneumocócica', age: '2 meses', description: 'Pneumonia e meningite', urgent: true, category: 'Primeiras doses' },
  { name: 'Rotavírus', age: '2 meses', description: 'Diarreia por rotavírus', urgent: true, category: 'Primeiras doses' },
  { name: 'Pentavalente', age: '4 meses', description: 'DTP + Hib + Hepatite B (2ª dose)', urgent: false, category: 'Segundas doses' },
  { name: 'VIP', age: '4 meses', description: 'Poliomielite inativada (2ª dose)', urgent: false, category: 'Segundas doses' },
  { name: 'Pneumocócica', age: '4 meses', description: 'Pneumonia e meningite (2ª dose)', urgent: false, category: 'Segundas doses' },
  { name: 'Rotavírus', age: '4 meses', description: 'Diarreia por rotavírus (2ª dose)', urgent: false, category: 'Segundas doses' },
  { name: 'Pentavalente', age: '6 meses', description: 'DTP + Hib + Hepatite B (3ª dose)', urgent: false, category: 'Terceiras doses' },
  { name: 'VIP', age: '6 meses', description: 'Poliomielite inativada (3ª dose)', urgent: false, category: 'Terceiras doses' },
  { name: 'Pneumocócica', age: '6 meses', description: 'Pneumonia e meningite (3ª dose)', urgent: false, category: 'Terceiras doses' },
  { name: 'Meningocócica C', age: '3 meses', description: 'Meningite meningocócica', urgent: false, category: 'Primeiras doses' },
  { name: 'Meningocócica C', age: '5 meses', description: 'Meningite meningocócica (2ª dose)', urgent: false, category: 'Segundas doses' },
  { name: 'Febre Amarela', age: '9 meses', description: 'Febre amarela', urgent: false, category: 'Dose única' },
  { name: 'Tríplice Viral', age: '12 meses', description: 'Sarampo, caxumba e rubéola', urgent: false, category: 'Primeiras doses' },
  { name: 'Pneumocócica', age: '12 meses', description: 'Pneumonia e meningite (reforço)', urgent: false, category: 'Reforços' },
  { name: 'Meningocócica C', age: '12 meses', description: 'Meningite meningocócica (reforço)', urgent: false, category: 'Reforços' },
  { name: 'DTP', age: '15 meses', description: 'Difteria, tétano e coqueluche', urgent: false, category: 'Reforços' },
  { name: 'VOP', age: '15 meses', description: 'Poliomielite oral', urgent: false, category: 'Reforços' },
  { name: 'Hepatite A', age: '15 meses', description: 'Hepatite A', urgent: false, category: 'Dose única' },
  { name: 'Tetra Viral', age: '15 meses', description: 'Sarampo, caxumba, rubéola e varicela', urgent: false, category: 'Segundas doses' }
]

// Dados mock dos postos de saúde
const HEALTH_CENTERS = [
  { id: 1, name: 'UBS Centro', address: 'Rua das Flores, 123 - Centro', distance: 0.8, phone: '(11) 3333-1111', hours: '7h às 17h', hasVaccines: true, waitTime: '15 min' },
  { id: 2, name: 'UBS Vila Nova', address: 'Av. Principal, 456 - Vila Nova', distance: 1.2, phone: '(11) 3333-2222', hours: '7h às 17h', hasVaccines: true, waitTime: '30 min' },
  { id: 3, name: 'UBS Jardim América', address: 'Rua do Parque, 789 - Jardim América', distance: 2.1, phone: '(11) 3333-3333', hours: '7h às 17h', hasVaccines: false, waitTime: '45 min' },
  { id: 4, name: 'UBS São José', address: 'Rua São José, 321 - São José', distance: 2.8, phone: '(11) 3333-4444', hours: '7h às 17h', hasVaccines: true, waitTime: '20 min' },
  { id: 5, name: 'UBS Esperança', address: 'Av. da Esperança, 654 - Esperança', distance: 3.5, phone: '(11) 3333-5555', hours: '7h às 17h', hasVaccines: true, waitTime: '10 min' },
  { id: 6, name: 'UBS Santa Maria', address: 'Rua Santa Maria, 987 - Santa Maria', distance: 4.2, phone: '(11) 3333-6666', hours: '7h às 17h', hasVaccines: false, waitTime: '25 min' }
]

// Dados de notícias e atualizações sobre vacinas
const VACCINE_NEWS = [
  {
    id: 1,
    title: "Ministério da Saúde atualiza calendário de vacinação infantil",
    summary: "Novas diretrizes incluem ajustes nos prazos de algumas vacinas e inclusão de novos imunizantes.",
    date: "2024-01-15",
    type: "update",
    urgent: false,
    content: "O Ministério da Saúde publicou novas diretrizes para o calendário nacional de vacinação, com ajustes importantes nos prazos de aplicação de algumas vacinas infantis. As principais mudanças incluem a antecipação da segunda dose da vacina meningocócica C e novos intervalos para a vacina pneumocócica."
  },
  {
    id: 2,
    title: "Alerta: Surto de sarampo em região metropolitana",
    summary: "Casos de sarampo aumentaram 300% em crianças não vacinadas. Autoridades reforçam importância da tríplice viral.",
    date: "2024-01-10",
    type: "alert",
    urgent: true,
    content: "A Secretaria de Saúde confirmou 45 casos de sarampo na região metropolitana, sendo 89% em crianças que não receberam a vacina tríplice viral. O surto evidencia a importância da manutenção das altas coberturas vacinais para prevenir o ressurgimento de doenças já controladas."
  },
  {
    id: 3,
    title: "Campanha Nacional de Vacinação contra Poliomielite",
    summary: "Meta é vacinar 95% das crianças menores de 5 anos. Campanha vai até o final de março.",
    date: "2024-01-08",
    type: "campaign",
    urgent: false,
    content: "Iniciou-se a Campanha Nacional de Vacinação contra a Poliomielite, com meta de imunizar 95% das crianças menores de 5 anos. A campanha é essencial para manter o Brasil livre da poliomielite, doença que pode causar paralisia permanente."
  },
  {
    id: 4,
    title: "Coqueluche: Aumento de casos preocupa especialistas",
    summary: "Bebês menores de 6 meses são os mais vulneráveis. Vacinação de gestantes é fundamental.",
    date: "2024-01-05",
    type: "alert",
    urgent: true,
    content: "O número de casos de coqueluche aumentou 150% no último ano, principalmente em bebês menores de 6 meses. A vacinação de gestantes com a dTpa é fundamental para proteger os recém-nascidos através da transferência de anticorpos maternos."
  },
  {
    id: 5,
    title: "Nova vacina contra meningite B aprovada para uso",
    summary: "Anvisa aprova nova vacina que oferece proteção adicional contra meningite meningocócica tipo B.",
    date: "2024-01-03",
    type: "update",
    urgent: false,
    content: "A Anvisa aprovou o uso de uma nova vacina contra meningite meningocócica tipo B, oferecendo proteção adicional contra uma das formas mais graves da doença. A vacina estará disponível inicialmente na rede privada."
  },
  {
    id: 6,
    title: "Importância da vacinação em dia: Proteção coletiva",
    summary: "Entenda como manter as vacinas em dia protege não apenas seu filho, mas toda a comunidade.",
    date: "2024-01-01",
    type: "education",
    urgent: false,
    content: "A vacinação em dia é fundamental não apenas para proteger individualmente cada criança, mas para manter a imunidade coletiva da população. Quando 95% das pessoas estão vacinadas, protegemos também aqueles que não podem se vacinar por questões médicas."
  }
]

interface Baby {
  id: string
  name: string
  birthDate: string
  vaccines: VaccineRecord[]
}

interface VaccineRecord {
  name: string
  date: string
  completed: boolean
  nextDue?: string
}

export default function VaccineApp() {
  const [babies, setBabies] = useState<Baby[]>([])
  const [selectedBaby, setSelectedBaby] = useState<string>('')
  const [isAddBabyOpen, setIsAddBabyOpen] = useState(false)
  const [newBabyName, setNewBabyName] = useState('')
  const [newBabyBirthDate, setNewBabyBirthDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [newsFilter, setNewsFilter] = useState<string>('all')

  // Carregar dados do localStorage
  useEffect(() => {
    const savedBabies = localStorage.getItem('vaccine-babies')
    if (savedBabies) {
      setBabies(JSON.parse(savedBabies))
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    if (babies.length > 0) {
      localStorage.setItem('vaccine-babies', JSON.stringify(babies))
    }
  }, [babies])

  // Calcular idade em meses
  const calculateAgeInMonths = (birthDate: string) => {
    const birth = new Date(birthDate)
    const now = new Date()
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
    return months
  }

  // Obter vacinas pendentes para um bebê
  const getPendingVaccines = (baby: Baby) => {
    const ageInMonths = calculateAgeInMonths(baby.birthDate)
    const completedVaccines = baby.vaccines.filter(v => v.completed).map(v => v.name)
    
    return VACCINE_SCHEDULE.filter(vaccine => {
      const vaccineAgeMonths = parseInt(vaccine.age.split(' ')[0])
      return vaccineAgeMonths <= ageInMonths && !completedVaccines.includes(vaccine.name)
    })
  }

  // Obter próximas vacinas
  const getUpcomingVaccines = (baby: Baby) => {
    const ageInMonths = calculateAgeInMonths(baby.birthDate)
    
    return VACCINE_SCHEDULE.filter(vaccine => {
      const vaccineAgeMonths = parseInt(vaccine.age.split(' ')[0])
      return vaccineAgeMonths > ageInMonths && vaccineAgeMonths <= ageInMonths + 2
    })
  }

  // Calcular progresso de vacinação
  const getVaccinationProgress = (baby: Baby) => {
    const ageInMonths = calculateAgeInMonths(baby.birthDate)
    const applicableVaccines = VACCINE_SCHEDULE.filter(vaccine => {
      const vaccineAgeMonths = parseInt(vaccine.age.split(' ')[0])
      return vaccineAgeMonths <= ageInMonths
    })
    
    const completedVaccines = baby.vaccines.filter(v => v.completed).length
    const totalApplicable = applicableVaccines.length
    
    return totalApplicable > 0 ? Math.round((completedVaccines / totalApplicable) * 100) : 0
  }

  // Adicionar novo bebê
  const addBaby = () => {
    if (!newBabyName || !newBabyBirthDate) {
      alert('Preencha todos os campos')
      return
    }

    const newBaby: Baby = {
      id: Date.now().toString(),
      name: newBabyName,
      birthDate: newBabyBirthDate,
      vaccines: []
    }

    setBabies([...babies, newBaby])
    setSelectedBaby(newBaby.id)
    setNewBabyName('')
    setNewBabyBirthDate('')
    setIsAddBabyOpen(false)
  }

  // Marcar vacina como concluída
  const markVaccineCompleted = (vaccineName: string) => {
    if (!selectedBaby) return

    setBabies(babies.map(baby => {
      if (baby.id === selectedBaby) {
        const existingVaccine = baby.vaccines.find(v => v.name === vaccineName)
        if (existingVaccine) {
          return {
            ...baby,
            vaccines: baby.vaccines.map(v =>
              v.name === vaccineName ? { ...v, completed: true, date: new Date().toISOString().split('T')[0] } : v
            )
          }
        } else {
          return {
            ...baby,
            vaccines: [...baby.vaccines, {
              name: vaccineName,
              date: new Date().toISOString().split('T')[0],
              completed: true
            }]
          }
        }
      }
      return baby
    }))
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Filtrar notícias
  const getFilteredNews = () => {
    if (newsFilter === 'all') return VACCINE_NEWS
    return VACCINE_NEWS.filter(news => news.type === newsFilter)
  }

  // Obter ícone para tipo de notícia
  const getNewsIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'update': return <TrendingUp className="w-5 h-5 text-blue-600" />
      case 'campaign': return <Syringe className="w-5 h-5 text-green-600" />
      case 'education': return <Info className="w-5 h-5 text-purple-600" />
      default: return <Newspaper className="w-5 h-5 text-gray-600" />
    }
  }

  // Obter cor do card para tipo de notícia
  const getNewsCardColor = (type: string, urgent: boolean) => {
    if (urgent) return 'border-red-200 bg-red-50 dark:bg-red-950/20'
    switch (type) {
      case 'alert': return 'border-orange-200 bg-orange-50 dark:bg-orange-950/20'
      case 'update': return 'border-blue-200 bg-blue-50 dark:bg-blue-950/20'
      case 'campaign': return 'border-green-200 bg-green-50 dark:bg-green-950/20'
      case 'education': return 'border-purple-200 bg-purple-50 dark:bg-purple-950/20'
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-800'
    }
  }

  const currentBaby = babies.find(baby => baby.id === selectedBaby)
  const pendingVaccines = currentBaby ? getPendingVaccines(currentBaby) : []
  const upcomingVaccines = currentBaby ? getUpcomingVaccines(currentBaby) : []
  const vaccinationProgress = currentBaby ? getVaccinationProgress(currentBaby) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
              <Baby className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              VacinaBaby
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-light">
            Mantenha as vacinas do seu bebê sempre em dia
          </p>
        </div>

        {/* Seleção de Bebê */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-center justify-center">
          <select 
            value={selectedBaby} 
            onChange={(e) => setSelectedBaby(e.target.value)}
            className="w-full lg:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione um bebê</option>
            {babies.map(baby => (
              <option key={baby.id} value={baby.id}>
                {baby.name} ({calculateAgeInMonths(baby.birthDate)} meses)
              </option>
            ))}
          </select>

          <Dialog open={isAddBabyOpen} onOpenChange={setIsAddBabyOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Bebê
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Bebê</DialogTitle>
                <DialogDescription>
                  Preencha as informações do bebê para começar o controle de vacinas
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Bebê</Label>
                  <Input
                    id="name"
                    value={newBabyName}
                    onChange={(e) => setNewBabyName(e.target.value)}
                    placeholder="Digite o nome do bebê"
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={newBabyBirthDate}
                    onChange={(e) => setNewBabyBirthDate(e.target.value)}
                  />
                </div>
                <Button onClick={addBaby} className="w-full">
                  Adicionar Bebê
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Progresso de Vacinação */}
        {currentBaby && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Progresso de Vacinação - {currentBaby.name}</span>
                <span className="text-2xl font-bold text-blue-600">{vaccinationProgress}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${vaccinationProgress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {currentBaby.vaccines.filter(v => v.completed).length}
                  </p>
                  <p className="text-sm text-gray-600">Concluídas</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{pendingVaccines.length}</p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{upcomingVaccines.length}</p>
                  <p className="text-sm text-gray-600">Próximas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedBaby ? (
          <Card className="text-center py-12">
            <CardContent>
              <Baby className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Nenhum bebê selecionado</h3>
              <p className="text-gray-600 mb-4">Adicione um bebê para começar o controle de vacinas</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="vaccines" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="vaccines" className="flex items-center gap-2 py-3">
                <Syringe className="w-4 h-4" />
                Vacinas
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2 py-3">
                <Calendar className="w-4 h-4" />
                Calendário
              </TabsTrigger>
              <TabsTrigger value="locations" className="flex items-center gap-2 py-3">
                <MapPin className="w-4 h-4" />
                Postos
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2 py-3">
                <Newspaper className="w-4 h-4" />
                Notícias
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vaccines" className="space-y-6">
              {/* Vacinas Pendentes */}
              {pendingVaccines.length > 0 && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <Bell className="w-5 h-5" />
                      Vacinas Pendentes ({pendingVaccines.length})
                    </CardTitle>
                    <CardDescription>
                      Vacinas que já deveriam ter sido aplicadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {pendingVaccines.map((vaccine, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border">
                          <div className="flex-1 mb-3 sm:mb-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{vaccine.name}</h4>
                              {vaccine.urgent && <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Urgente</span>}
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{vaccine.category}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{vaccine.description}</p>
                            <p className="text-sm text-gray-500">Idade recomendada: {vaccine.age}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => markVaccineCompleted(vaccine.name)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Marcar como Feita
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Bell className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Próximas Vacinas */}
              {upcomingVaccines.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <Clock className="w-5 h-5" />
                      Próximas Vacinas ({upcomingVaccines.length})
                    </CardTitle>
                    <CardDescription>
                      Vacinas que serão necessárias em breve
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {upcomingVaccines.map((vaccine, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
                          <div className="flex-1 mb-3 sm:mb-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{vaccine.name}</h4>
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{vaccine.category}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{vaccine.description}</p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">Idade recomendada: {vaccine.age}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Bell className="w-4 h-4 mr-2" />
                            Agendar Lembrete
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {pendingVaccines.length === 0 && upcomingVaccines.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Syringe className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-xl font-semibold mb-2 text-green-700">Parabéns!</h3>
                    <p className="text-gray-600">Todas as vacinas estão em dia para a idade atual do bebê</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calendário Completo de Vacinas</CardTitle>
                  <CardDescription>
                    Calendário oficial de vacinação do Ministério da Saúde
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {VACCINE_SCHEDULE.map((vaccine, index) => {
                      const isCompleted = currentBaby?.vaccines.some(v => v.name === vaccine.name && v.completed)
                      const ageInMonths = calculateAgeInMonths(currentBaby?.birthDate || '')
                      const vaccineAgeMonths = parseInt(vaccine.age.split(' ')[0])
                      const isPending = vaccineAgeMonths <= ageInMonths && !isCompleted
                      
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            isCompleted
                              ? 'bg-green-50 border-green-200 dark:bg-green-950/20'
                              : isPending
                              ? 'bg-red-50 border-red-200 dark:bg-red-950/20'
                              : 'bg-gray-50 border-gray-200 dark:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{vaccine.name}</h4>
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{vaccine.age}</span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{vaccine.category}</span>
                                {isCompleted && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Concluída</span>}
                                {isPending && <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Pendente</span>}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{vaccine.description}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="locations" className="space-y-6">
              {/* Busca */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Buscar Postos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Digite o nome ou endereço do posto"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Postos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Postos de Saúde Próximos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {HEALTH_CENTERS
                      .filter(center =>
                        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        center.address.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((center) => (
                      <div key={center.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">{center.name}</h4>
                              {center.hasVaccines ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Vacinas Disponíveis</span>
                              ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Sem Vacinas</span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">{center.address}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Navigation className="w-4 h-4" />
                                {center.distance} km
                              </span>
                              <span>{center.phone}</span>
                              <span>{center.hours}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Espera: {center.waitTime}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <MapPin className="w-4 h-4 mr-2" />
                              Ver no Mapa
                            </Button>
                            <Button size="sm">
                              Ligar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="news" className="space-y-6">
              {/* Filtros de Notícias */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtrar Notícias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={newsFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => setNewsFilter('all')}
                    >
                      Todas
                    </Button>
                    <Button
                      size="sm"
                      variant={newsFilter === 'alert' ? 'default' : 'outline'}
                      onClick={() => setNewsFilter('alert')}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Alertas
                    </Button>
                    <Button
                      size="sm"
                      variant={newsFilter === 'update' ? 'default' : 'outline'}
                      onClick={() => setNewsFilter('update')}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Atualizações
                    </Button>
                    <Button
                      size="sm"
                      variant={newsFilter === 'campaign' ? 'default' : 'outline'}
                      onClick={() => setNewsFilter('campaign')}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Syringe className="w-4 h-4 mr-1" />
                      Campanhas
                    </Button>
                    <Button
                      size="sm"
                      variant={newsFilter === 'education' ? 'default' : 'outline'}
                      onClick={() => setNewsFilter('education')}
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <Info className="w-4 h-4 mr-1" />
                      Educação
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Notícias */}
              <div className="grid gap-6">
                {getFilteredNews().map((news) => (
                  <Card key={news.id} className={getNewsCardColor(news.type, news.urgent)}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {getNewsIcon(news.type)}
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2 flex items-center gap-2">
                              {news.title}
                              {news.urgent && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-normal">
                                  Urgente
                                </span>
                              )}
                            </CardTitle>
                            <CardDescription className="text-base">
                              {news.summary}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {formatDate(news.date)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        {news.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            news.type === 'alert' ? 'bg-red-100 text-red-800' :
                            news.type === 'update' ? 'bg-blue-100 text-blue-800' :
                            news.type === 'campaign' ? 'bg-green-100 text-green-800' :
                            news.type === 'education' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {news.type === 'alert' ? 'Alerta' :
                             news.type === 'update' ? 'Atualização' :
                             news.type === 'campaign' ? 'Campanha' :
                             news.type === 'education' ? 'Educação' : 'Notícia'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Share2 className="w-4 h-4 mr-2" />
                            Compartilhar
                          </Button>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ler Mais
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Informações Educativas */}
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <Info className="w-5 h-5" />
                    Importância da Vacinação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <h4 className="font-semibold mb-2 text-green-700">✅ Proteção Individual</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        As vacinas protegem seu filho contra doenças graves que podem causar sequelas permanentes ou até mesmo a morte.
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <h4 className="font-semibold mb-2 text-blue-700">🛡️ Proteção Coletiva</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quando 95% da população está vacinada, protegemos também quem não pode se vacinar por questões médicas.
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <h4 className="font-semibold mb-2 text-red-700">⚠️ Riscos da Não Vacinação</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        A queda na cobertura vacinal pode levar ao ressurgimento de doenças já controladas, como sarampo e poliomielite.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}