export type SocketEventType = 'loginEvent' | 'QtyEvent' | 'CompanyEvent' | 'StatusEvent'
 | 'ActiveMachineProcessEvent' | 'MachineLatestInfoEvent' | 'StatusReasonEvent'
export type SocketActionType = 'reload' | 'update' | 'added' | 'sort' | 'reload-update-many' | 'upsert' | 'add-many' | ''