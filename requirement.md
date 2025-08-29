# AI  Practical  Training  and  Assessment  Project

News-AI-RAG:  Personalized  News  Intelligent  Knowledge  Base

"anything unreasonable or flaws in this doc should be pointed out by AI assistant."

## Functional  requirements

1. Implement  a  timed  task  mechanism  to  obtain  news  information  through  RSS,  web  crawling  and  intelligent  proxy  tools  (need Comply  with  web  crawler specifications  and  safety  guidelines).
2. For  large  models  deployed  based  on  Ollama,  the  qwen3:8b  model  is  recommended.
3. Build  a  local  knowledge  base  system,  configure  the  embedding  model  (all-MiniLM-L6-v2  is  recommended),  and  reranking  model (ms-marco-MiniLM-L-6-v2  is  recommended)  and  large  language  models.
4. Write  the  captured  information  into  the  knowledge  base  system  through  the  API,  supporting  structured  data  (which  can  be  organized  through  Excel) and  unstructured  data  types.
5. After  the  information  is  successfully  stored,  an  email  reminder  will  be  automatically  sent  (with  customized  title  and  content).
6. Provide  user  login  function.
7. Support  knowledge  base  content  management  after  login:  view  data  list  (can  be  filtered  by  type/time),  execute  order. Delete  individual  or  batch  files,  edit  metadata  (such  as  tags,  sources),  and  support  uploading  multiple  types  of  files  through  the  page  to  knowledge  base.
8. After  logging  in,  semantic  search  function  is  provided:  the  knowledge  base  content  is  searched  first  based  on  the  user's  question,  and  the  results  are  sorted  by  similarity.
9. If  the  knowledge  base  does  not  match  relevant  data,  it  will  automatically  trigger  an  online  query  (such  as  calling  the  Baidu  search  API)  and  return the  first  three  results.  Results are  output  after  inference  by  the  large  language  model.
10. After  logging  in,  a  knowledge  base  data  cluster  analysis  report  is  provided,  showing  the  distribution  of  the  top  10  keywords.

## Technical  requirements

0. The entire project should be concise, using minimal 3rd party libraries.
1. Technology  stack  selection:  native JavaScript for  the  front  end,  Node.js  for  the  back  end. The database  uses MongoDB,  and  the  vector  database  uses  FAISS.
2. Data  storage  design:  Metadata  (such  as  data  ID,  data  type,  etc.)  is  stored  in  a  relational  database,  vector  data  is  stored  separately  in  the  FAISS  vector  database  to  achieve  data  classification  management  and  efficient  retrieval.
3. Framework  integration:  The  core  business  logic  is  developed  using  the  LangChain  framework  to  support  knowledge  base  construction  and  retrieval Enhanced  functionality.
4. LLM  call:  Interaction  with  LLM  services  is  achieved  through  standardized  API  interfaces  to  ensure  service  calls standardization  and  scalability.
5. Identity  authentication:  The  login  function  should  preferably  use  JWT  solution  to  ensure the  security  and  reliability  of  user  authentication.

## Submission  requirements

1. Project  data  submission  requirements: I will upload  all  relevant  data  of  this  project  to  the  GitHub public repository.
2. A  product  requirement  document  (PRD)  must  be  provided.
3. An  outline  design  document  and  technical  architecture  document  must  be  provided.
4. Product  prototype  design  files  must  be  provided.
5. The  complete  front-end  and  back-end  codes  must  be  provided.
6. Unit  testing,  integration  testing,  and  API  testing  related  codes  must  be  provided.
7. the artitecture of the DataBase designing should be illustrated.
8. A  project  description  document  (README.md)  must  be  provided  to  clearly  explain  how  to  deploy,  run,  and  use  the  project.
9. Optional:  Prepare  a  project  introduction  document  for  technical  sharing.

## PRD  Template

1. Introduction  (background,  target  users,  product  vision)
2. User  Stories  and  Scenario  Descriptions
3. Product  Scope  and  Features
4. Product-Specific  AI  Requirements
     - Model  requirements  (functions,  performance  indicators)
     - Data  requirements  (source,  quantity,  quality,  and  annotation)
     - Algorithm  Boundaries  and  Interpretability
     - Evaluation  Criteria
     - Ethics  and  Compliance
5. Non-functional  requirements  (performance,  security,  usability,  etc.)
6. Release  standards  and  metrics
7. Pending  items  and  future  plans

## AI prompts

Generating more sample(fake) Chinese news into /news.csv , with 2 columns:

- news category: the category name of this news in 2~3 chars, the total categories count shoule be around 20.
- news title:
  - length should be diverse and be in the range of 15 to 40 chars.
  - topic should cover various aspects of the society.
  - You might want to insert a few emojis or Emoticon Symbols(text emoji) to express sentiment.
  - the punctuation should also be diverse.

examples:

```csv
Category, hot index, title
教育, 3984572, 年轻教师因开学产生焦虑
教育, 10976262, 上海一小学今年仅招到22人
职场, 98765677, 女孩上班不挣钱反欠公司13800元
```
