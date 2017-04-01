CREATE TABLE users (
    id integer NOT NULL,
    username text NOT NULL,
    hash text NOT NULL,
    salt text NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    stripe_id text NOT NULL,
    plan text NOT NULL
);


CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE users_id_seq OWNED BY users.id;


ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);



ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
