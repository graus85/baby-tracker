-- Sostituisci <USER_UUID> con l'UUID dell'utente (auth.users.id)
insert into feeds (user_id, date, time, method, amount, unit, milk_type, note)
values ('<USER_UUID>', current_date, '08:00', 'bottle', 120, 'ml', 'formula', 'Feed mattutino di test');

insert into diapers (user_id, date, time, pee, poop, note)
values ('<USER_UUID>', current_date, '09:30', true, false, 'Pee di test');
