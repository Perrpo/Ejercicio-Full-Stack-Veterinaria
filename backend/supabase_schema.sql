-- Supabase Postgres schema for VetCare
-- Run this in Supabase SQL Editor.

-- Enable useful extensions
create extension if not exists pgcrypto;

-- usuarios profile table (1:1 with auth.users)
create table if not exists public.usuarios (
  id_usuario uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  apellido text not null,
  email text unique not null,
  telefono text,
  direccion text,
  rol text not null default 'cliente' check (rol in ('admin','veterinario','cliente')),
  fecha_registro timestamptz not null default now()
);

create table if not exists public.servicios (
  id_servicio bigserial primary key,
  nombre text not null,
  descripcion text,
  precio integer not null,
  duracion integer not null default 60
);

create table if not exists public.pacientes (
  id_paciente bigserial primary key,
  id_usuario uuid not null references public.usuarios(id_usuario) on delete cascade,
  nombre text not null,
  especie text not null,
  raza text,
  edad integer,
  peso numeric(5,2)
);

create table if not exists public.citas (
  id_cita bigserial primary key,
  id_usuario uuid not null references public.usuarios(id_usuario) on delete cascade,
  id_paciente bigint not null references public.pacientes(id_paciente) on delete cascade,
  id_servicio bigint not null references public.servicios(id_servicio) on delete cascade,
  fecha_cita timestamptz not null,
  estado text not null default 'pendiente' check (estado in ('pendiente','confirmada','completada','cancelada'))
);

create table if not exists public.pagos (
  id_pago bigserial primary key,
  id_cita bigint not null references public.citas(id_cita) on delete cascade,
  metodo_pago text not null check (metodo_pago in ('efectivo','tarjeta_credito','tarjeta_debito','transferencia')),
  monto integer not null,
  fecha_pago timestamptz not null default now(),
  estado text not null default 'pendiente' check (estado in ('pendiente','pagado','fallido'))
);

create table if not exists public.examenes (
  id_examen bigserial primary key,
  id_paciente bigint not null references public.pacientes(id_paciente) on delete cascade,
  tipo_examen text not null,
  fecha_examen timestamptz not null,
  resultado text,
  observaciones text,
  estado text not null default 'pendiente' check (estado in ('pendiente','en_proceso','completado'))
);

-- Recommended indexes
create index if not exists idx_pacientes_usuario on public.pacientes(id_usuario);
create index if not exists idx_citas_usuario on public.citas(id_usuario);
create index if not exists idx_citas_paciente on public.citas(id_paciente);
create index if not exists idx_pagos_cita on public.pagos(id_cita);
create index if not exists idx_examenes_paciente on public.examenes(id_paciente);

-- Enable Row Level Security
alter table public.usuarios enable row level security;
alter table public.pacientes enable row level security;
alter table public.citas enable row level security;
alter table public.pagos enable row level security;
alter table public.examenes enable row level security;
alter table public.servicios enable row level security;

-- Helper: is_admin (checks usuarios.rol)
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.usuarios u
    where u.id_usuario = uid and u.rol = 'admin'
  );
$$;

grant execute on function public.is_admin(uuid) to authenticated;

grant usage on schema public to anon, authenticated;

-- usuarios policies
create policy if not exists "usuarios_self_select" on public.usuarios
for select to authenticated
using (id_usuario = auth.uid() or public.is_admin(auth.uid()));

create policy if not exists "usuarios_self_update" on public.usuarios
for update to authenticated
using (id_usuario = auth.uid() or public.is_admin(auth.uid()))
with check (id_usuario = auth.uid() or public.is_admin(auth.uid()));

-- Allow service role/admin API to manage usuarios
create policy if not exists "usuarios_admin_all" on public.usuarios
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- servicios policies: readable by everyone logged in, mutable by admins
create policy if not exists "servicios_read" on public.servicios
for select to authenticated
using (true);

create policy if not exists "servicios_admin_write" on public.servicios
for insert to authenticated
with check (public.is_admin(auth.uid()));

create policy if not exists "servicios_admin_update" on public.servicios
for update to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy if not exists "servicios_admin_delete" on public.servicios
for delete to authenticated
using (public.is_admin(auth.uid()));

-- pacientes policies
create policy if not exists "pacientes_owner_read" on public.pacientes
for select to authenticated
using (id_usuario = auth.uid() or public.is_admin(auth.uid()));

create policy if not exists "pacientes_owner_write" on public.pacientes
for insert to authenticated
with check (id_usuario = auth.uid() or public.is_admin(auth.uid()));

create policy if not exists "pacientes_owner_update" on public.pacientes
for update to authenticated
using (id_usuario = auth.uid() or public.is_admin(auth.uid()))
with check (id_usuario = auth.uid() or public.is_admin(auth.uid()));

create policy if not exists "pacientes_owner_delete" on public.pacientes
for delete to authenticated
using (id_usuario = auth.uid() or public.is_admin(auth.uid()));

-- citas policies
create policy if not exists "citas_owner_read" on public.citas
for select to authenticated
using (id_usuario = auth.uid() or public.is_admin(auth.uid()));

create policy if not exists "citas_owner_write" on public.citas
for insert to authenticated
with check (id_usuario = auth.uid() or public.is_admin(auth.uid()));

create policy if not exists "citas_owner_update" on public.citas
for update to authenticated
using (id_usuario = auth.uid() or public.is_admin(auth.uid()))
with check (id_usuario = auth.uid() or public.is_admin(auth.uid()));

create policy if not exists "citas_owner_delete" on public.citas
for delete to authenticated
using (id_usuario = auth.uid() or public.is_admin(auth.uid()));

-- pagos policies (access derived from cita ownership)
create policy if not exists "pagos_owner_read" on public.pagos
for select to authenticated
using (
  public.is_admin(auth.uid())
  or exists(
    select 1 from public.citas c
    where c.id_cita = pagos.id_cita and c.id_usuario = auth.uid()
  )
);

create policy if not exists "pagos_owner_write" on public.pagos
for insert to authenticated
with check (
  public.is_admin(auth.uid())
  or exists(
    select 1 from public.citas c
    where c.id_cita = pagos.id_cita and c.id_usuario = auth.uid()
  )
);

create policy if not exists "pagos_owner_update" on public.pagos
for update to authenticated
using (
  public.is_admin(auth.uid())
  or exists(
    select 1 from public.citas c
    where c.id_cita = pagos.id_cita and c.id_usuario = auth.uid()
  )
)
with check (
  public.is_admin(auth.uid())
  or exists(
    select 1 from public.citas c
    where c.id_cita = pagos.id_cita and c.id_usuario = auth.uid()
  )
);

create policy if not exists "pagos_owner_delete" on public.pagos
for delete to authenticated
using (
  public.is_admin(auth.uid())
  or exists(
    select 1 from public.citas c
    where c.id_cita = pagos.id_cita and c.id_usuario = auth.uid()
  )
);

-- examenes policies (access derived from paciente ownership)
create policy if not exists "examenes_owner_read" on public.examenes
for select to authenticated
using (
  public.is_admin(auth.uid())
  or exists(
    select 1 from public.pacientes p
    where p.id_paciente = examenes.id_paciente and p.id_usuario = auth.uid()
  )
);

create policy if not exists "examenes_owner_write" on public.examenes
for insert to authenticated
with check (
  public.is_admin(auth.uid())
  or exists(
    select 1 from public.pacientes p
    where p.id_paciente = examenes.id_paciente and p.id_usuario = auth.uid()
  )
);

create policy if not exists "examenes_owner_update" on public.examenes
for update to authenticated
using (
  public.is_admin(auth.uid())
  or exists(
    select 1 from public.pacientes p
    where p.id_paciente = examenes.id_paciente and p.id_usuario = auth.uid()
  )
)
with check (
  public.is_admin(auth.uid())
  or exists(
    select 1 from public.pacientes p
    where p.id_paciente = examenes.id_paciente and p.id_usuario = auth.uid()
  )
);

create policy if not exists "examenes_owner_delete" on public.examenes
for delete to authenticated
using (
  public.is_admin(auth.uid())
  or exists(
    select 1 from public.pacientes p
    where p.id_paciente = examenes.id_paciente and p.id_usuario = auth.uid()
  )
);
