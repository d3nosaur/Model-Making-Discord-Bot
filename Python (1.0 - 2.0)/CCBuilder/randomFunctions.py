def countCCs(s) :
    ccRows = []
    values_list = s.col_values(10)
    curNumber = 0
    for i in values_list:
        if i == "Being Added":
            ccRows.append(curNumber + 1)
        curNumber = curNumber+1
    return ccRows

    #Rows = 0
    #for i in values_list:
    #    Rows = Rows+1
#
#    for i in Rows:
#        if values_list[i] == "Being Added":
#            ccRows.append(i)
#    return ccRows

def getTemplate(job):
  tmplFirstLn, tmplLastLn = getTemplateBounds()
  for n in tmplFirstLn :
    if job in getJobs()[n]:
      return convertTemplate(getJobs()[n:tmplLastLn[tmplFirstLn.index(n)]+1], job)

"""
{0} name : CAPS
{1} name : Capitalize
{2} name : lower
{3} model : models/path
{4} job : normal
{5} description : defaults to {4} {1}

"""
def convertTemplate(template, job):

  template = removeModelLines(template)
  print(template)

  for line in range(len(template)) :
    template[line] = template[line].replace("{", "{{")
    template[line] = template[line].replace("}", "}}")
    if 'DarkRP.createJob' in template[line] :
      template[line] = 'TEAM_{0} = DarkRP.createJob("{4} {1}", {{\n'
    elif 'command = ' in template[line] :
      template[line] = '    command = "{2}",\n'
    elif "model =" in template[line] and not "weapons =" in template[line]:
      template[line] = '    model = "{3}",\n'
    elif "description = " in template[line]:
        template[line] = '    description = [[{5}]],\n'
    elif "max =" in template[line]:
      template[line] = '    max = 1,\n'
    elif "category = " in template[line]:
      template[line] = '    category = "Custom Jobs",\n'
  return template

def getFilledTemplate(template, s, r):
  values_list = s.row_values(r)
  name = values_list[0]
  model = values_list[2]
  job = values_list[3]
  description = values_list[3] + " " + values_list[0].capitalize()
  if values_list[1] == "Jedi":
    job = "Jedi"
  if values_list[4]:
    description = values_list[4]

  for k,v in enumerate(template):
    template[k] = v.format(name.upper().replace(" ", ""), name.capitalize(), name.lower().replace(" ", ""), model, job, description)
  return template

def removeModelLines(template):
  newTemplate = []
  for line in template :
    if ("model =" in line and "}," in line) or not ("models/" in line and not "model =" in line) and not ("}," in line and not "weapons =" in line):
      newTemplate.append(line)
  for line in newTemplate:
    if line == "\n":
      newTemplate.remove(line)
  return newTemplate


def getTemplateBounds():
  tmplFirstLn = []
  tmplLastLn = []
  jobsLines = getJobs()
  for line in range(len(jobsLines)):
    if "DarkRP.createJob" in jobsLines[line]:
      tmplFirstLn.append(line)
    elif "})" in jobsLines[line]:
      tmplLastLn.append(line)
  return tmplFirstLn, tmplLastLn

def getJobs():
  jobsFileR = open("CCBuilder/jobs.txt", "r")
  jobsLines = jobsFileR.readlines()
  jobsFileR.close()
  return jobsLines
