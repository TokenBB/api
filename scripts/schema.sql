use tokenbb;

create table categories (
  key char,
  name char
);

create table posts (
  author char,
  permlink char,
  category char,
  hidden bit default 0,

  foreign key (category) references categories(key),
);

create table replies (
  parent_author char,
  parent_permlink char,
  author char,
  permlink char,
  hidden bit default 0,

  foreign key (parent_author) references posts(author),
  foreign key (parent_permlink) references posts(permlink)
);

create table banned (
  username char
);
