
CREATE TABLE pricing (
    id integer NOT NULL,
    category text NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    sales integer,
    orders integer,
    products integer,
    category_id integer NOT NULL,
    range_start integer,
    range_end integer
);



CREATE SEQUENCE pricing_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE pricing_id_seq OWNED BY pricing.id;


ALTER TABLE ONLY pricing ALTER COLUMN id SET DEFAULT nextval('pricing_id_seq'::regclass);



ALTER TABLE ONLY pricing
    ADD CONSTRAINT pricing_pkey PRIMARY KEY (id);
