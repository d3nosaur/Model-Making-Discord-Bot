import discord
import gspread
import os
import dev_info
from oauth2client.service_account import ServiceAccountCredentials
from CCBuilder.randomFunctions import *
from discord.utils import get

async def getNewJobs1(ctx):
    #try:
    os.chdir(dev_info.botPathing)
    print(os.getcwd())
    scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name('TWDiscordPYSecure.json', scope)
    client = gspread.authorize(creds)

    sheet = client.open('[tw]_ccs').sheet1
    ccRows = countCCs(sheet)
    #except:
    #    await ctx.message.channel.send("Called too many times recently, please wait.")
    #    return False
    jobsFileW = open("CCBuilder/newJobs.txt", "w")

    for row in ccRows:
        for k,v in enumerate(getFilledTemplate(getTemplate(sheet.cell(row, 4).value), sheet, row), start=1):
            jobsFileW.write(v.rstrip() + "\n")
            print(v.rstrip())

    jobsFileW.close()

    commissionRequest = get(ctx.guild.emojis, name="commission_request")
    newJobsEmbed = discord.Embed(
        title = 'New Jobs',
        description = f'This file contains all of the extra DarkRP jobs for the remaining CCs listed as "Being Added" in https://docs.google.com/spreadsheets/d/1DDol0a4aUP8M0Dh5UTQXnIvpl3dSXWZV7rPttePxm7M/edit?usp=sharing\n\nReact with {commissionRequest} to set them as "In Server"',
        colour = 3066993
    )

    newJobsEmbedMessage = await ctx.send(embed=newJobsEmbed)
    await newJobsEmbedMessage.add_reaction(commissionRequest)

    await ctx.message.channel.send(file=discord.File('CCBuilder/newJobs.txt'))
    return

async def clearBeingAdded(channel):
    scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name('CCBuilder/TWDiscordPYSecure.json', scope)
    client = gspread.authorize(creds)
    sheet = client.open('[tw]_ccs').sheet1

    ccRows = countCCs(sheet)

    for row in ccRows:
        sheet.update_cell(row+1, 11, 'In Server')

    await channel.send('Cleared the "Being Added" Custom Classes')
    return
#ccRows = countCCs(sheet)
#jobsFileW = open("newJobs.txt", "w")
#for r in ccRows:
#  for k,v in enumerate(getFilledTemplate(getTemplate(sheet.cell(row=r, column=4).value), sheet, r), start=1):
#    #print("hi")
#    jobsFileW.write(v.rstrip() + "\n")
#    print(v.rstrip() )
#
#jobsFile.write(getJedi_JOBS(sheet, i))
#jobsFileW.close()
