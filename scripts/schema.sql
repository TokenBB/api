use tokenbb;

create table categories(
  id int auto_increment primary key,
  name char(64)
);

create table topics(
  id int auto_increment primary key,
  author char(64),
  permlink char(255),
  category int,
  foreign key(category) references categories(id) 
);

create table replies(
  id int auto_increment primary key,
  parent_id int,
  author char(64),
  permlink char(255),
  foreign key(parent_id) references topics(id) on delete cascade
);

create table hidden_topics(
  id int auto_increment primary key,
  topic_id int,
  hidden_by char(255),
  foreign key(topic_id) references topics(id)
);

create table hidden_replies(
  id int auto_increment primary key,
  reply_id int,
  hidden_by char(255),
  foreign key(reply_id) references replies(id)
);

create table banned_users(
  id int auto_increment primary key,
  username char(64),
  banned_by char(255)
);
