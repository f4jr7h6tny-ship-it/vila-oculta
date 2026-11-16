-- Shared village tally. Rows are unowned: one counter per village, no user data.
create table if not exists village_votes (
  id text primary key,
  votes integer not null default 0 check (votes >= 0)
);

insert into village_votes (id, votes) values
  ('konoha', 0),
  ('suna', 0),
  ('kiri', 0),
  ('kumo', 0),
  ('iwa', 0),
  ('ame', 0)
on conflict (id) do nothing;
