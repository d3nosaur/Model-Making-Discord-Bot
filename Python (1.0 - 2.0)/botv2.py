import requests
import dev_info
from CCBuilder.main import *
from discord.ext import commands
from discord.utils import get

client = commands.Bot(command_prefix = '!')

@client.event
async def on_ready():
    print('Model Making Bot is Online.')
    activity = discord.Game(name=dev_info.hostingStatus)
    await client.change_presence(status=discord.Status.dnd, activity=activity)

@client.event
async def on_raw_reaction_add(payload):
    guild = client.get_guild(payload.guild_id)
    channel = discord.utils.get(guild.text_channels, id=payload.channel_id)
    message = await channel.fetch_message(payload.message_id)
    user = discord.utils.get(message.guild.members, id=payload.user_id)

    if message.author.bot == True and user.bot == False:
        await message.remove_reaction(payload.emoji, user)
    else:
        return #Everything past this point is a user reacting to a bots message

    for item in message.embeds:
        if item.title == "Tickets":
            await TicketFunction(payload)
            return
        elif item.title.startswith("Approval Request"):
            await ApprovalRequest(payload, item)
            return
        elif item.title.startswith("Commission Request"):
            await CommissionRequest(payload, item)
            return
        elif item.title.startswith("Upload Request"):
            await UploadRequest(payload, item)
            return
        elif item.title.startswith("New Jobs"):
            await clearBeingAdded(channel)
            return

async def TicketFunction(payload):
    guild = client.get_guild(payload.guild_id)
    channel = discord.utils.get(guild.text_channels, id=payload.channel_id)
    message = await channel.fetch_message(payload.message_id)
    user = discord.utils.get(message.guild.members, id=payload.user_id)

    if payload.emoji.name == 'approval_request':
        category = discord.utils.get(guild.categories, name='Approval Tickets')

        amount = 1
        for channel in category.text_channels:
            if user.name.lower() in channel.name.lower():
                amount = amount + 1

        cloningChannel = discord.utils.get(guild.text_channels, name='approval-base-ticket')
        channel = await cloningChannel.clone(name=f'approval-ticket-{user.name}-{amount}')

        userPermissions = discord.PermissionOverwrite(
            read_messages = True,
            add_reactions = True,
            view_channel = True,
            send_messages = True,
            embed_links = True,
            attach_files = True,
            read_message_history = True,
            external_emojis = True
        )

        globalPermissions = discord.PermissionOverwrite(
            read_messages = False,
            add_reactions = False,
            view_channel = False,
            send_messages = False,
            embed_links = False,
            attach_files = False,
            read_message_history = False,
            external_emojis = False
        )

        overwrites = {user:userPermissions, discord.utils.get(guild.roles, name='Upper Administration'):userPermissions, discord.utils.get(guild.roles, name='Clonewars DVL'):userPermissions, guild.default_role:globalPermissions}
        await channel.edit(name=f'approval-ticket-{user.name}-{amount}', nsfw=False, category=category, position=2, overwrites = overwrites)
        await channel.edit(position=0)

        for channels in channel.category.text_channels:
            if channels.name == 'approved-tickets' or channels.name == 'approval-base-ticket':
                await channels.edit(position=0)

        approvalRequest = get(guild.emojis, name="approval_request")
        ApprovalStart = discord.Embed(
            title = f'Approval Request - {user.name} - {amount}',
            description = f"This is the Custom Class/Ship approving section. This bot will ask you a couple of questions about your Custom Class/Ship then when a member of Affairs, Development, the Head Model Maker, or the DVL sees this you will get a response.\n\n*Getting a response shouldn't take longer than 3 days, if it does take longer, mention one of the people above*\n\nReact with a {approvalRequest} if you are ready to begin",
            colour = 15158332,
        )
        ApprovalStart.set_footer(text='1/5 Pages')

        message = await channel.send(embed=ApprovalStart)
        await message.add_reaction(approvalRequest)
        return

    if payload.emoji.name == 'commission_request':
        category = discord.utils.get(guild.categories, name='Commission Tickets')

        amount = 1
        for channel in category.text_channels:
            if user.name.lower() in channel.name.lower():
                amount = amount + 1

        cloningChannel = discord.utils.get(guild.text_channels, name='commission-base-ticket')
        channel = await cloningChannel.clone(name=f'commission-ticket-{user.name}-{amount}')

        userPermissions = discord.PermissionOverwrite(
            read_messages = True,
            add_reactions = True,
            view_channel = True,
            send_messages = True,
            embed_links = True,
            attach_files = True,
            read_message_history = True,
            external_emojis = True
        )

        globalPermissions = discord.PermissionOverwrite(
            read_messages = False,
            add_reactions = False,
            view_channel = False,
            send_messages = False,
            embed_links = False,
            attach_files = False,
            read_message_history = False,
            external_emojis = False
        )

        overwrites = {user:userPermissions, discord.utils.get(guild.roles, name='Upper Administration'):userPermissions, discord.utils.get(guild.roles, name='Clonewars DVL'):userPermissions, discord.utils.get(guild.roles, name='Model Maker'):userPermissions, guild.default_role:globalPermissions}
        await channel.edit(name=f'commission-ticket-{user.name}-{amount}', nsfw=False, category=category, position=2, overwrites = overwrites)
        await channel.edit(position=0)

        for channels in channel.category.text_channels:
            if channels.name == 'commission-tickets' or channels.name == 'commission-base-ticket':
                await channels.edit(position=0)

        commissionRequest = get(guild.emojis, name="commission_request")
        commissionStart = discord.Embed(
            title = f'Commission Request - {user.name} - {amount}',
            description = f"This is the Custom Class/Ship commission request section. This bot will ask you a couple of questions about your Custom Class/Ship then if a Model Maker wants to take the request they will accept it.\n\n*If your ticket is up for long unanswered, that usually means either\n1. Nobody on the team is capable of doing it\n2. The budget isn't good enough for the work required\nIn either case, talk to the Head Model Maker and he will help you get it sorted.*\n\nReact with a {commissionRequest} if you are ready to begin",
            colour = 15158332,
        )
        commissionStart.set_footer(text='1/7 Pages')

        message = await channel.send(embed=commissionStart)
        await message.add_reaction(commissionRequest)
        return

    if payload.emoji.name == 'cc_cs_request':
        category = discord.utils.get(guild.categories, name='Upload Tickets')

        amount = 1
        for channel in category.text_channels:
            if user.name.lower() in channel.name.lower() and channel.name.lower().endswith("responses") == False:
                amount = amount + 1

        cloningChannel = discord.utils.get(guild.text_channels, name='upload-base-ticket')
        channel = await cloningChannel.clone(name=f'upload-ticket-{user.name}-{amount}')

        channel2 = await cloningChannel.clone(name=f'upload-ticket-{user.name}-{amount}-responses')

        userPermissions = discord.PermissionOverwrite(
            read_messages = True,
            add_reactions = True,
            view_channel = True,
            send_messages = True,
            embed_links = True,
            attach_files = True,
            read_message_history = True,
            external_emojis = True
        )

        globalPermissions = discord.PermissionOverwrite(
            read_messages = False,
            add_reactions = False,
            view_channel = False,
            send_messages = False,
            embed_links = False,
            attach_files = False,
            read_message_history = False,
            external_emojis = False
        )

        overwrites = {user:userPermissions, discord.utils.get(guild.roles, name='Upper Administration'):userPermissions, discord.utils.get(guild.roles, name='Clonewars DVL'):userPermissions, guild.default_role:globalPermissions}
        overwrites2 = {discord.utils.get(guild.roles, name='Upper Administration'):userPermissions, discord.utils.get(guild.roles, name='Clonewars DVL'):userPermissions, guild.default_role:globalPermissions}
        await channel.edit(name=f'upload-ticket-{user.name}-{amount}', nsfw=False, category=category, position=2, overwrites = overwrites)
        await channel2.edit(name=f'upload-ticket-{user.name}-{amount}-responses', nsfw=False, category=category, position=2, overwrites = overwrites2)
        await channel.edit(position=0)
        await channel2.edit(position=1)

        for channels in channel.category.text_channels:
            if channels.name == 'upload-tickets' or channels.name == 'upload-base-ticket':
                await channels.edit(position=0)

        uploadRequest = get(guild.emojis, name="cc_cs_request")
        uploadStart = discord.Embed(
            title = f'Upload Request - {user.name} - {amount}',
            description = f"This is the CC/CS upload request section. This bot will ask you some finalizing questions about your CC that will then be the information put into the server.\n\n*Ensure that everything you respond with is correct as after you have made a response it can not be edited without making a separate ticket. Along with this make sure that you keep your answers as one message, without creating any extra lines.*\n\nReact with a {uploadRequest} if you are ready to begin",
            colour = 15158332,
        )
        uploadStart.set_footer(text='1/10 Pages')

        message = await channel.send(embed=uploadStart)
        await message.add_reaction(uploadRequest)
        return

async def ApprovalRequest(payload, item):
    guild = client.get_guild(payload.guild_id)
    channel = discord.utils.get(guild.text_channels, id=payload.channel_id)
    message = await channel.fetch_message(payload.message_id)
    user = discord.utils.get(message.guild.members, id=payload.user_id)

    for embed in message.embeds:
        if embed.title[19:-4] != user.name:
            return

    if item.footer.text.startswith('1'):
        if payload.emoji.name == 'approval_request':
            category = discord.utils.get(guild.categories, name='Approval Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower():
                    amount = amount + 1

            Approval1_1 = discord.Embed(
                title = f'Approval Request - {user.name} - {amount}',
                description = f"**Custom Ship or Custom Class? React to this message after you wrote your response.**",
                colour = 15158332,
            )
            Approval1_1.set_footer(text='2/5 Pages')

            await message.edit(embed = Approval1_1)
            return

    elif item.footer.text.startswith('2'):
        if payload.emoji.name == 'approval_request':
            category = discord.utils.get(guild.categories, name='Approval Tickets')

            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower():
                    amount = amount + 1

            Approval1_1 = discord.Embed(
                title = f'Approval Request - {user.name} - {amount}',
                description = f"**What Job/Ship will this be based off of? React to this message after you wrote your response.**",
                colour = 15158332,
            )
            Approval1_1.set_footer(text='3/5 Pages')
            await message.edit(embed = Approval1_1)
            return

    elif item.footer.text.startswith('3'):
        if payload.emoji.name == 'approval_request':
            category = discord.utils.get(guild.categories, name='Approval Tickets')

            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower():
                    amount = amount + 1

            Approval1_1 = discord.Embed(
                title = f'Approval Request - {user.name} - {amount}',
                description = f"**Give me a short description of you Custom Class/Ship? React to this message after you wrote your response.**",
                colour = 15158332,
            )
            Approval1_1.set_footer(text='4/5 Pages')

            await message.edit(embed = Approval1_1)
            channel = message.channel
            return

    elif item.footer.text.startswith('4'):
        if payload.emoji.name == 'approval_request':
            category = discord.utils.get(guild.categories, name='Approval Tickets')

            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower():
                    amount = amount + 1

            Approval1_1 = discord.Embed(
                title = f'Approval Request - {user.name} - {amount}',
                description = f"**This is the final page. React to this message when you are ready to send your responses to get approved.**",
                colour = 15158332,
            )
            Approval1_1.set_footer(text='5/5 Pages')

            await message.edit(embed = Approval1_1)
            channel = message.channel
            return

    elif item.footer.text.startswith('5'):
        if payload.emoji.name == 'approval_request':
            category = discord.utils.get(guild.categories, name='Approval Tickets')

            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower():
                    amount = amount + 1

            Approval1_1 = discord.Embed(
                title = f'Approval Request - {user.name} - {amount}',
                description = f"Your ticket has been sent to Affairs, Development, the DVL, and the Head Model Maker.\n\n*Getting a response shouldn't take longer than 3 days, if it does take longer, mention one of the people above*",
                colour = 15158332,
            )
            Approval1_1.set_footer(text='5/5 Pages')
            await message.clear_reactions()
            await message.edit(embed = Approval1_1)
            channel = message.channel
            return
    return

async def CommissionRequest(payload, item):
    guild = client.get_guild(payload.guild_id)
    channel = discord.utils.get(guild.text_channels, id=payload.channel_id)
    message = await channel.fetch_message(payload.message_id)
    user = discord.utils.get(message.guild.members, id=payload.user_id)

    for embed in message.embeds:
        if embed.title[21:-4] != user.name:
            return

    if item.footer.text.startswith('1'):
        if payload.emoji.name == 'commission_request':
            category = discord.utils.get(guild.categories, name='Commission Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower():
                    amount = amount + 1

            Commission1 = discord.Embed(
                title = f'Commission Request - {user.name} - {amount}',
                description = f"**Custom Ship or Custom Class? React to this message after you wrote your response.**",
                colour = 15158332,
            )
            Commission1.set_footer(text='2/7 Pages')

            await message.edit(embed = Commission1)
            return
    if item.footer.text.startswith('2'):
        if payload.emoji.name == 'commission_request':
            category = discord.utils.get(guild.categories, name='Commission Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower():
                    amount = amount + 1

            Commission1 = discord.Embed(
                title = f'Commission Request - {user.name} - {amount}',
                description = f"**Give me a basic description as to what you want (Preferably with pictures). React to this message after you wrote your response.**",
                colour = 15158332,
            )
            Commission1.set_footer(text='3/7 Pages')

            await message.edit(embed = Commission1)
            return
    if item.footer.text.startswith('3'):
        if payload.emoji.name == 'commission_request':
            category = discord.utils.get(guild.categories, name='Commission Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower():
                    amount = amount + 1

            Commission1 = discord.Embed(
                title = f'Commission Request - {user.name} - {amount}',
                description = f"**What is the budget for this model (Look at the Model Maker channel descriptions in Teamspeak for usual rates)? React to this message after you wrote your response.**",
                colour = 15158332,
            )
            Commission1.set_footer(text='4/7 Pages')

            await message.edit(embed = Commission1)
            return
    if item.footer.text.startswith('4'):
        if payload.emoji.name == 'commission_request':
            category = discord.utils.get(guild.categories, name='Commission Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower():
                    amount = amount + 1

            Commission1 = discord.Embed(
                title = f'Commission Request - {user.name} - {amount}',
                description = f"**Do you have a preferred Model Maker? React to this message after you wrote your response.**",
                colour = 15158332,
            )
            Commission1.set_footer(text='5/7 Pages')

            await message.edit(embed = Commission1)
            return
    if item.footer.text.startswith('5'):
        if payload.emoji.name == 'commission_request':
            category = discord.utils.get(guild.categories, name='Commission Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower():
                    amount = amount + 1

            Commission1 = discord.Embed(
                title = f'Commission Request - {user.name} - {amount}',
                description = f"**Confirm that your previous responses are accurate, when you are ready to send your responses to the Model Makers react to this message.**",
                colour = 15158332,
            )
            Commission1.set_footer(text='6/7 Pages')

            await message.edit(embed = Commission1)
            return
    if item.footer.text.startswith('6'):
        if payload.emoji.name == 'commission_request':
            category = discord.utils.get(guild.categories, name='Commission Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower():
                    amount = amount + 1

            Commission1 = discord.Embed(
                title = f'Commission Request - {user.name} - {amount}',
                description = f"**Your request has been sent to the Model Makers**\n\n*If your ticket is up for long unanswered, that usually means either\n1. Nobody on the team is capable of doing it\n2. The budget isn't good enough for the work required\nIn either case, talk to the Head Model Maker and he will help you get it sorted.*",
                colour = 15158332,
            )
            Commission1.set_footer(text='7/7 Pages')

            await message.edit(embed = Commission1)
            await message.clear_reactions()
            return
    return

async def UploadRequest(payload, item):
    guild = client.get_guild(payload.guild_id)
    channel = discord.utils.get(guild.text_channels, id=payload.channel_id)
    message = await channel.fetch_message(payload.message_id)
    user = discord.utils.get(message.guild.members, id=payload.user_id)

    for embed in message.embeds:
        if embed.title[17:-4] != user.name:
            print(embed.title[17:-4])
            print(user.name)
            print(user.name)
            return

    if item.footer.text.startswith('1'):
        if payload.emoji.name == 'cc_cs_request':
            category = discord.utils.get(guild.categories, name='Upload Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower() and channel.name.lower().endswith("responses") == False:
                    amount = amount + 1

            uploadRequest = get(guild.emojis, name="cc_cs_request")
            upload2 = discord.Embed(
                title = f'Upload Request - {user.name} - {amount}',
                description = f"This is the CC/CS upload request section. This bot will ask you some finalizing questions about your CC that will then be the information put into the server.\n\n*Ensure that everything you respond with is correct as after you have made a response it can not be edited without making a separate ticket. Along with this make sure that you keep your answers as one message, without creating any extra lines.*\n\n**What is the name of your Custom Class/Ship** | *ex. Yoshi*\n\nReact with {uploadRequest} after you answered the question",
                colour = 15158332,
            )
            upload2.set_footer(text='2/10 Pages')

            await message.edit(embed = upload2)
            return

    if item.footer.text.startswith('2'):
        if payload.emoji.name == 'cc_cs_request':
            category = discord.utils.get(guild.categories, name='Upload Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower() and channel.name.lower().endswith("responses") == False:
                    amount = amount + 1

            for i in category.text_channels:
                if i.name.lower() == f"{message.channel.name.lower()}-responses":
                    async for message2 in message.channel.history(limit=1):
                        await i.send(message2.content)
                        await message.channel.send(f"**Responses**\n\n**1.** *{i.last_message.content}*")
                        await message2.delete()

            uploadRequest = get(guild.emojis, name="cc_cs_request")
            upload2 = discord.Embed(
                title = f'Upload Request - {user.name} - {amount}',
                description = f"This is the CC/CS upload request section. This bot will ask you some finalizing questions about your CC that will then be the information put into the server.\n\n*Ensure that everything you respond with is correct as after you have made a response it can not be edited without making a separate ticket. Along with this make sure that you keep your answers as one message, without creating any extra lines.*\n\n**Pick the answer from this list that fits your Custom Class/Ship**\n**1. Jedi**\n**2. Clone**\n**3. Mercenary**\n**4. Clone Ship**\n**5. Jedi Ship**\n**6. Other **\n\nReact with {uploadRequest} after you answered the question",
                colour = 15158332,
            )
            upload2.set_footer(text='3/10 Pages')

            await message.edit(embed = upload2)
            return

    if item.footer.text.startswith('3'):
        if payload.emoji.name == 'cc_cs_request':
            category = discord.utils.get(guild.categories, name='Upload Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower() and channel.name.lower().endswith("responses") == False:
                    amount = amount + 1

            for i in category.text_channels:
                if i.name.lower() == f"{message.channel.name.lower()}-responses":
                    async for message2 in message.channel.history(limit=1):
                        await i.send(message2.content)
                        async for message3 in message.channel.history(limit=100):
                            if message3.content.startswith("**Responses**"):
                                await message3.edit(content=f"{message3.content}\n**2.** *{i.last_message.content}*")
                        await message2.delete()

            uploadRequest = get(guild.emojis, name="cc_cs_request")
            upload3 = discord.Embed(
                title = f'Upload Request - {user.name} - {amount}',
                description = f"This is the CC/CS upload request section. This bot will ask you some finalizing questions about your CC that will then be the information put into the server.\n\n*Ensure that everything you respond with is correct as after you have made a response it can not be edited without making a separate ticket. Along with this make sure that you keep your answers as one message, without creating any extra lines.*\n\n**What is the description you want for the Custom Class/Ship**\n*Note: This will show up as the job description if it is a Custom Class*\n\nReact with {uploadRequest} after you answered the question",
                colour = 15158332,
            )
            upload3.set_footer(text='4/10 Pages')

            await message.edit(embed = upload3)
            return

    if item.footer.text.startswith('4'):
        if payload.emoji.name == 'cc_cs_request':
            category = discord.utils.get(guild.categories, name='Upload Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower() and channel.name.lower().endswith("responses") == False:
                    amount = amount + 1

            for i in category.text_channels:
                if i.name.lower() == f"{message.channel.name.lower()}-responses":
                    async for message2 in message.channel.history(limit=1):
                        await i.send(message2.content)
                        async for message3 in message.channel.history(limit=100):
                            if message3.content.startswith("**Responses**"):
                                await message3.edit(content=f"{message3.content}\n**3.** *{i.last_message.content}*")
                        await message2.delete()

            uploadRequest = get(guild.emojis, name="cc_cs_request")
            upload3 = discord.Embed(
                title = f'Upload Request - {user.name} - {amount}',
                description = f"This is the CC/CS upload request section. This bot will ask you some finalizing questions about your CC that will then be the information put into the server.\n\n*Ensure that everything you respond with is correct as after you have made a response it can not be edited without making a separate ticket. Along with this make sure that you keep your answers as one message, without creating any extra lines.*\n\n**What is the workshop link for your model**\n\nReact with {uploadRequest} after you answered the question",
                colour = 15158332,
            )
            upload3.set_footer(text='5/10 Pages')

            await message.edit(embed = upload3)
            return

    if item.footer.text.startswith('5'):
        if payload.emoji.name == 'cc_cs_request':
            category = discord.utils.get(guild.categories, name='Upload Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower() and channel.name.lower().endswith("responses") == False:
                    amount = amount + 1

            for i in category.text_channels:
                if i.name.lower() == f"{message.channel.name.lower()}-responses":
                    async for message2 in message.channel.history(limit=1):
                        await i.send(message2.content)
                        async for message3 in message.channel.history(limit=100):
                            if message3.content.startswith("**Responses**"):
                                await message3.edit(content=f"{message3.content}\n**4.** *{i.last_message.content}*")
                        await message2.delete()

            uploadRequest = get(guild.emojis, name="cc_cs_request")
            upload3 = discord.Embed(
                title = f'Upload Request - {user.name} - {amount}',
                description = f"This is the CC/CS upload request section. This bot will ask you some finalizing questions about your CC that will then be the information put into the server.\n\n*Ensure that everything you respond with is correct as after you have made a response it can not be edited without making a separate ticket. Along with this make sure that you keep your answers as one message, without creating any extra lines.*\n\n**What is the normal name you go by in the community**\n\nReact with {uploadRequest} after you answered the question",
                colour = 15158332,
            )
            upload3.set_footer(text='6/10 Pages')

            await message.edit(embed = upload3)
            return

    if item.footer.text.startswith('6'):
        if payload.emoji.name == 'cc_cs_request':
            category = discord.utils.get(guild.categories, name='Upload Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower() and channel.name.lower().endswith("responses") == False:
                    amount = amount + 1

            for i in category.text_channels:
                if i.name.lower() == f"{message.channel.name.lower()}-responses":
                    async for message2 in message.channel.history(limit=1):
                        await i.send(message2.content)
                        async for message3 in message.channel.history(limit=100):
                            if message3.content.startswith("**Responses**"):
                                await message3.edit(content=f"{message3.content}\n**5.** *{i.last_message.content}*")
                        await message2.delete()

            uploadRequest = get(guild.emojis, name="cc_cs_request")
            upload3 = discord.Embed(
                title = f'Upload Request - {user.name} - {amount}',
                description = f"This is the CC/CS upload request section. This bot will ask you some finalizing questions about your CC that will then be the information put into the server.\n\n*Ensure that everything you respond with is correct as after you have made a response it can not be edited without making a separate ticket. Along with this make sure that you keep your answers as one message, without creating any extra lines.*\n\n**What is the MDL of your model**\n*Can be obtained by right clicking on the model in the Q Menu, and clicking 'Copy to Clipboard'*\n\nReact with {uploadRequest} after you answered the question",
                colour = 15158332,
            )
            upload3.set_footer(text='7/10 Pages')

            await message.edit(embed = upload3)
            return

    if item.footer.text.startswith('7'):
        if payload.emoji.name == 'cc_cs_request':
            category = discord.utils.get(guild.categories, name='Upload Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower() and channel.name.lower().endswith("responses") == False:
                    amount = amount + 1

            for i in category.text_channels:
                if i.name.lower() == f"{message.channel.name.lower()}-responses":
                    async for message2 in message.channel.history(limit=1):
                        await i.send(message2.content)
                        async for message3 in message.channel.history(limit=100):
                            if message3.content.startswith("**Responses**"):
                                await message3.edit(content=f"{message3.content}\n**6.** *{i.last_message.content}*")
                        await message2.delete()

            uploadRequest = get(guild.emojis, name="cc_cs_request")
            upload3 = discord.Embed(
                title = f'Upload Request - {user.name} - {amount}',
                description = f"This is the CC/CS upload request section. This bot will ask you some finalizing questions about your CC that will then be the information put into the server.\n\n*Ensure that everything you respond with is correct as after you have made a response it can not be edited without making a separate ticket. Along with this make sure that you keep your answers as one message, without creating any extra lines.*\n\n**Is this a rework of a currently existing CC/CS**\n\nReact with {uploadRequest} after you answered the question",
                colour = 15158332,
            )
            upload3.set_footer(text='8/10 Pages')

            await message.edit(embed = upload3)
            return

    if item.footer.text.startswith('8'):
        if payload.emoji.name == 'cc_cs_request':
            category = discord.utils.get(guild.categories, name='Upload Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower() and channel.name.lower().endswith("responses") == False:
                    amount = amount + 1

            for i in category.text_channels:
                if i.name.lower() == f"{message.channel.name.lower()}-responses":
                    async for message2 in message.channel.history(limit=1):
                        await i.send(message2.content)
                        async for message3 in message.channel.history(limit=100):
                            if message3.content.startswith("**Responses**"):
                                await message3.edit(content=f"{message3.content}\n**7.** *{i.last_message.content}*")
                        await message2.delete()

            uploadRequest = get(guild.emojis, name="cc_cs_request")
            upload3 = discord.Embed(
                title = f'Upload Request - {user.name} - {amount}',
                description = f"This is the CC/CS upload request section. This bot will ask you some finalizing questions about your CC that will then be the information put into the server.\n\n*Ensure that everything you respond with is correct as after you have made a response it can not be edited without making a separate ticket. Along with this make sure that you keep your answers as one message, without creating any extra lines.*\n\n**This is the final page, read over your previous answers and react with {uploadRequest} when you are ready to submit your answers**",
                colour = 15158332,
            )
            upload3.set_footer(text='9/10 Pages')

            await message.edit(embed = upload3)
            return

    if item.footer.text.startswith('9'):
        if payload.emoji.name == 'cc_cs_request':
            category = discord.utils.get(guild.categories, name='Upload Tickets')
            amount = 0
            for channel in category.text_channels:
                if user.name.lower() in channel.name.lower() and channel.name.lower().endswith("responses") == False:
                    amount = amount + 1

            uploadRequest = get(guild.emojis, name="cc_cs_request")
            upload3 = discord.Embed(
                title = f'Upload Request - {user.name} - {amount}',
                description = f"**Your answers have been sent to the Developers for approval, Once your model is approved wait a week and your CC/CS should be in server. If it isn't than contact one of the Developers**",
                colour = 15158332,
            )
            upload3.set_footer(text='10/10 Pages')

            await message.edit(embed = upload3)
            await message.clear_reactions()
            return
    return

@client.command()
@commands.has_any_role("Clonewars DVL", "Head Model Maker", "Upper Administration")
async def approve(ctx):
    channel = ctx.message.channel
    if channel.name.startswith('approval-ticket'):
        async for message in channel.history(limit=200):
            for embed in message.embeds:
                try:
                    if embed.title.startswith('Approval Request'):
                        ApprovalEnd1 = discord.Embed(
                            description = f"**Your model has been approved by {ctx.message.author}**",
                            colour = 15158332,
                        )
                        ApprovalEnd1.set_footer(text='5/5 Pages')
                        await message.clear_reactions()
                        await message.edit(embed = ApprovalEnd1)
                        await message.channel.send(f"This ticket was approved by {ctx.message.author}")

                        channel1 = discord.utils.get(ctx.message.guild.text_channels, name='approved-tickets')
                        await channel1.send(f"{ctx.message.author} has approved {channel.name}")

                        await ctx.message.delete()
                except:
                    print("Empty Embed Issue - Line 708")

@client.command()
@commands.has_permissions(administrator=True)
async def upload(ctx, arg):
    channel = ctx.message.channel
    if channel.name.startswith('upload-ticket'):
        async for message in channel.history(limit=200):
            for embed in message.embeds:
                if embed.title.startswith("Upload Request"):
                    ApprovalEnd1 = discord.Embed(
                        description = f"**Your model has been approved by {ctx.message.author}**",
                        colour = 15158332,
                    )
                    ApprovalEnd1.set_footer(text='')
                    await message.clear_reactions()
                    await message.edit(embed = ApprovalEnd1)

                    channel1 = discord.utils.get(ctx.message.guild.text_channels, name=f'{message.channel.name}-responses')

                    sheetValues = []
                    async for message in channel1.history(limit=7):
                        sheetValues.append(message.content)
                    sheetValues.reverse()

                    scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
                    os.chdir(dev_info.botPathing)
                    creds = ServiceAccountCredentials.from_json_keyfile_name('TWDiscordPYSecure.json', scope)
                    client = gspread.authorize(creds)

                    sheet = client.open('[tw]_ccs').sheet1

                    #sheet.append_row(values = [sheetValues[0], sheetValues[1], sheetValues[2], arg, sheetValues[3], "", sheetValues[4], "", "", "Being Added"], value_input_option='RAW', insert_data_option=None, table_range=None)
                    sheet.append_row(values = [sheetValues[0], sheetValues[1], sheetValues[5], arg, sheetValues[2], sheetValues[3], "", sheetValues[4], "", "Being Added"], value_input_option='RAW', insert_data_option=None, table_range=None)

                    await ctx.message.delete()

@client.command()
@commands.has_any_role("Model Maker", "Senior Model Maker", "Head Model Maker", "Upper Administration")
async def claim(ctx):
    channel = ctx.message.channel
    if channel.name.startswith('commission-ticket'):
        async for message in channel.history(limit=200):
            for embed in message.embeds:
                try:
                    if embed.title.startswith('Commission Request'):
                        CommissionEnd1 = discord.Embed(
                            description = f"**Your commission has been accepted by {ctx.message.author}**",
                            colour = 15158332,
                        )
                        CommissionEnd1.set_footer(text='7/7 Pages')
                        await message.clear_reactions()
                        await message.edit(embed = CommissionEnd1)

                        await channel.send(f'This ticket has been claimed by {ctx.message.author}')

                        await ctx.message.delete()

                        for newCategory in ctx.guild.categories:
                            if newCategory.name == "Claimed Commission Tickets":
                                await message.channel.edit(category=newCategory)
                except:
                    print("Empty Embed line 765")

@client.command()
@commands.has_any_role("Senior Model Maker", "Head Model Maker", "Upper Administration")
async def unclaim(ctx):
    channel = ctx.message.channel
    if channel.name.startswith('commission-ticket'):
        async for message in channel.history(limit=200):
            for embed in message.embeds:
                try:
                    if embed.description[2:].startswith('Your commission has been accepted by'):
                        CommissionEnd1 = discord.Embed(
                            title = f'Commission Request',
                            description = f"**Your request has been sent to the Model Makers**\n\n*If your ticket is up for long unanswered, that usually means either\n1. Nobody on the team is capable of doing it\n2. The budget isn't good enough for the work required\nIn either case, talk to the Head Model Maker and he will help you get it sorted.*",
                            colour = 15158332,
                        )
                        CommissionEnd1.set_footer(text='7/7 Pages')
                        await message.clear_reactions()
                        await message.edit(embed = CommissionEnd1)

                        await channel.send(f'This ticket has been unclaimed by {ctx.message.author}')

                        await ctx.message.delete()

                        for newCategory in ctx.guild.categories:
                            if newCategory.name == "Commission Tickets":
                                await message.channel.edit(category=newCategory)
                except:
                    print("Empty Embed line 765")

@client.command()
@commands.has_permissions(administrator=True)
async def initialstartup(ctx):
    informationEmbed = discord.Embed(
        title = 'Discord Information',
        description = 'This discord is a place where model commissions and approvals happen.\n\nBefore you purchase a Custom Class or Custom Ship it is recommended that you get your idea approved and have a budget if you are commissioning a model.',
        colour = discord.Colour.blue()
    )

    discordRulesEmbed = discord.Embed(
        title = 'Discord Rules',
        description = "**The rules of the discord, violating these rules could result in your removal from this discord.**\n\n**1.** Keep chat friendly\n**2.** No spamming\n**3.** Don't post NSFW content\n**4.** Use appropriate usernames\n**5.** Use common sense\n**6.** Don't misuse the channels\n\n*Some channels may have their own rules, look at the pinned messages to see them*",
        colour = 15158332
    )

    ccRulesEmbed = discord.Embed(
        title = 'Custom Class Rules',
        description = "**The rules for Custom Classes, violating these rules could result in you having to purchase a Rework and have the model remade**\n\n**1.** Purchasing a Custom Class does not make you immune to being removed from your position\n**2.** Custom Classes must be approved before they get added into the server\n**3.** Addons found off the workshop are not allowed to have any extra content\n**4.** Custom Classes must have the same height and hitbox as the original job's model\n**6.** Each custom class must use a unique model, unless the original custom class holder allows otherwise\n**6.** Custom Classes can not be traded between players\n\n*This is just a cut down version of the rules, to find the entirety of the rules, use this document. https://docs.google.com/document/d/1moQwLKni-mEyI6bOLTc6DXmghu4llixOBXHpOwOOK5o/edit?usp=sharing*",
        colour = 10181046
    )

    csRulesEmbed = discord.Embed(
        title = 'Custom Ship Rules',
        description = "**The rules for Custom Ships, violating these rules could result in you having to purchase a Rework and have the model remade**\n\n**1.** Purchasing a Custom Ship does not make you immune to being removed from your position\n**2.** Custom Ships must be approved before they get added into the server\n**4.** Custom Ships can only be retextures of currently existing ships\n**5.** Lore Ships can not be used for Custom Ship models\n**6.** Custom Ships can not be traded between players\n\n*Currently the only ships that are allowed to be made as Custom Ships are the ETA-2 and the Delta-7*",
        colour = 15105570
    )

    faqEmbed = discord.Embed(
        title = 'FAQ',
        description = "**Commonly Asked Questions**\n\n**Can I have additional weaponry or tools on my Custom Class**\nNo, Custom Classes are just a model change of a currently existing job\n\n**When is my Custom Class/Ship being added**\nWe add the Custom Classes/Ships as batches every 1-2 weeks \n*if it has been longer than 2 weeks contact either the Head of Model Creation, or a member of the Development UA*\n\n**How do I become a Model Maker**\nIf you already know how to make models talk to the Head Model Maker.\nIf you are interested in learning the Head Model Maker hosts classes when the team is short on model makers. Go talk to him if you want to try it out.\n\n**How much is a Commission**\nRealistically it depends on how much detail and what type of commission. If you are looking for average rates model makers show their default prices in their TS Channel descriptions\n\n*If you have any more questions, use the questions channel*",
        colour = 3066993
    )

    approvalRequest = get(ctx.guild.emojis, name="approval_request")
    commissionRequest = get(ctx.guild.emojis, name="commission_request")
    CCCSRequest = get(ctx.guild.emojis, name="cc_cs_request")
    ticketEmbed = discord.Embed(
        title = 'Tickets',
        description = f"**Tickets are used to get your model approved, request a model maker for a commission, and getting your CC/CS onto the server.\nTo begin a ticket, react to this message with one of the ticket reactions**\n\n**{approvalRequest}  Approval Request Ticket  {approvalRequest}**\nBefore you can get a CC/CS your idea must be approved by either a member of Affairs, a member of the Development UA, the DVL, or the Head Model Maker.\nOnce you create a ticket you will be asked a couple of questions to get an idea as to what you want.\n\n**{commissionRequest} Commission Request Ticket  {commissionRequest}**\nThis is used to request a model commission.\nWhen you create the ticket you will be asked a few questions about the budget, your idea, and what type of CS/CC you want.\n\n**{CCCSRequest}  CC/CS Request  {CCCSRequest}**\nWhen you have a model and your CC/CS is approved create this to get your CC/CS added to the next batch of models that will go onto the server. This is also used for if you are reworking a CC/CS\nOnce you create a ticket you will be asked a couple of questions to get an finalize your CC/CS.",
        colour = 7419530
    )
    await ctx.send(embed=informationEmbed)
    await ctx.send(embed=discordRulesEmbed)
    await ctx.send(embed=ccRulesEmbed)
    await ctx.send(embed=csRulesEmbed)
    await ctx.send(embed=faqEmbed)

    ticketEmbedMessage = await ctx.send(embed=ticketEmbed)
    await ticketEmbedMessage.add_reaction(approvalRequest)
    await ticketEmbedMessage.add_reaction(commissionRequest)
    await ticketEmbedMessage.add_reaction(CCCSRequest)

@client.command()
@commands.has_permissions(administrator=True)
async def botalive(ctx):
    await ctx.send("Hi, I'm alive")

@client.command()
@commands.has_permissions(administrator=True)
async def replacejobs(ctx):
    for attachment in ctx.message.attachments:
        attachment_url = ctx.message.attachments[0].url
        file_request = requests.get(attachment_url)
        content = file_request.content.decode(encoding="utf-8")
        print(file_request.content)
        #print("2")
        #await ctx.message.channel.send(await attachment.to_file())
        os.chdir(dev_info.botPathing)
        jobsFileW = open("CCBuilder/jobs.txt", "w", encoding="utf-8")
        jobsFileW.write(content)
        jobsFileW.close()

        await ctx.message.channel.send("it worked!")

@client.command()
@commands.has_permissions(administrator=True)
async def getnewjobs(ctx):
    await getNewJobs1(ctx)

client.run('')
