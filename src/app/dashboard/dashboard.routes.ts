import { Routes } from "@angular/router";
import { ViewDashboardComponent } from "./view-dashboard/view-dashboard.component";
import { ScheduleComponent } from "../features/schedule/schedule.component";
import { CustomersComponent } from "../features/customers/customers.component";
import { ConfigComponent } from "../features/config/config.component";
import { AppointmentsComponent } from "../features/appointments/appointments.component";
import { ResumeComponent } from "./components/resume/resume.component";
import { OfferedServicesComponent } from "../features/offered-services/offered-services.component";
import { ManagersComponent } from "@app/features/managers/managers.component";


export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: ViewDashboardComponent,
        children: [
            {path: '', component: ResumeComponent},
            { path: 'agenda', component: ScheduleComponent },
            { path: 'clientes', component: CustomersComponent },
            { path: 'turnos', component: AppointmentsComponent },
            { path: 'configuracion', component: ConfigComponent },
            { path: 'servicios', component: OfferedServicesComponent }
            { path: 'empleados', component: ManagersComponent}
        ]
    },
];
