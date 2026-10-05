# Project structure (file map)

Root: `README.md`, `database.json` (mock data, do not read), `CLAUDE.md`, `.claude/settings.json`.
Both apps: `src/{app,components,contexts,services,utils}`, `src/proxy.ts` (role guard), `next.config.ts`, `.env.local`.

## pettopia-fe (customer, :4001)
Extra deps: framer-motion, jsqr (QR scan), date-fns, clsx. `next.config.ts` rewrites `/api/v1/*` -> localhost:3000.

```
src/app/
  page.tsx, layout.tsx, loading.tsx         landing
  auth/{login,register,forgot}              auth pages
  home/ (page, qr/)                         public home, QR pet lookup
  join-us/                                  partner signup info
  user/                                     logged-in area (UserShell.tsx, layout.tsx)
    home/ profile/ edit-profile/ change-password/ upgrade/ prescription/
    pet/{list,new,[id],edit/[id]}
    appointments/{list,booking,[id],[id]/medical-record}
    community/{page,create,detail,edit/[id],history,manage}
src/components/
  layout/{Header,Footer,SideBar,SearchModal}
  auth/{LoginForm,RegisterForm}  common/Toast
  Chat ContinuousCalendar CustomAlert EditPetForm Notification(.jsx) NotificationBell
  NumberofPet ProtectedRouteGuard UpcomingMeetings timeline
src/contexts/{ToastContext,UserContext}
src/services/
  auth/authService            login/register/token
  user/userService            profile
  petcare/petService          pets, appointments, medical records (largest)
  communication/communicationService  community posts/comments
  payment/PaymentService      upgrade/payment
src/types/communication.ts
src/utils/{jwt,cookieHelper}
```

## pettopia-clinic-fe (partner, :4000)
Extra deps: recharts (dashboards). Roles: Admin, Staff, Clinic, Vet, User (applicant).

```
src/app/
  page.tsx layout.tsx  auth/{login,accepted}  change-password/
  admin/   dashboard manager-clinic manager-user clinic/[id] user/[id] profile edit-profile
  staff/   dashboard request-clinic-list request-vet-list post-report profile edit-profile
  clinic/  dashboard appointment(1.7k lines) assign-vet check-in medical[/id] service shift
           vet[/vetId] request-list profile edit-profile
  vet/     patients medical/[id] [inviteId]/accepted profile edit-profile
  user/    dashboard submit-clinic-certificate submit-vet-certificate waitting profile edit-profile
  (each role dir has layout.tsx + loading.tsx)
src/components/
  common/  Sidebar Dashboard Profile UpdateProfile RoleSwitcher NotificationBell Toast
  admin/   ManagerClinic ManagerUser ClinicDetail UserDetail
  staff/   RequestTable ClinicFormDetail VetFormDetail PostReport
  clinic/  Clinic-{AssignVet,CheckIn,InviteVet,Service,Shift,VetDetail} InviteMember{Button,Modal}
           ClinicInviteVet (UNUSED duplicate of Clinic-InviteVet)
  user/    ClinicCreateForm VetCreateForm MyGuide
  vet/     VetSchedule
  auth/    LoginForm RegisterForm
src/contexts/ToastContext
src/services/
  auth/authService  user/userService
  customer/{customerService,post}
  partner/{clinicService,shiftService,veterianrianService}
src/utils/{jwt,cookieHelper,location}
```
