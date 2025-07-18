export interface UnitInstanceDetailData {
  id: string
  serialNo: string
  unitId: string
  organizationId: string
  createdAt: Date
  updatedAt: Date
  unit: Unit
  operationalData: OperationalData[]
}

export interface OperationalData {
  id: string
  workHours: number
  actualWorkHours: number
  longitude: number
  latitude: number
  fuelUsage: number
  gpsTime: Date
  smr: number
  idleTime: number
  instanceId: string
  createdAt: Date
  updatedAt: Date
}

export interface Unit {
  id: string
  type: string
  manufacturer: string
  model: string
  modelType: string
  createdAt: Date
  updatedAt: Date
}
