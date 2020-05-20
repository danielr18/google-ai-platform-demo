import googleapiclient.discovery
PROJECT_ID = 'ai-platform-demo-7e3b1'
MODEL_NAME = 'BookReviewsSentiment'
VERSION_NAME = 'v1'

instances = [
    "This book was very easy to read. I really enjoyed it.",
    "I would not recommend this book to anyone",
    "This book is not interesting",
    "I am sure this book is chalk full of good info! However it is certainly not a beginners book to investing. If you're like me and have no idea what the definition of terms like 'net tangible assets', and 'sub working capital' are it may be best to find a true beginners book as a prequel to this one. Lots of good info I cant yet understand."
]

service = googleapiclient.discovery.build('ml', 'v1')
name = 'projects/{}/models/{}/versions/{}'.format(
    PROJECT_ID, MODEL_NAME, VERSION_NAME)

response = service.projects().predict(
    name=name,
    body={'instances': instances, 'probabilities': False}
).execute()

if 'error' in response:
    raise RuntimeError(response['error'])
else:
    print(response['predictions'])
