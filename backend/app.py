from flask import Flask,redirect,url_for,render_template,request,jsonify,abort,send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_restful import Api, Resource, reqparse, abort
from flask_cors import CORS
import datetime as dt
import os
import yaml
from pathlib import Path

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__,instance_path=os.path.join(BASE_DIR, 'instance'))

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.secret_key = "secret key"
app.config['JWT_SECRET_KEY'] = 'sk'
api = Api(app)
jwt = JWTManager(app)

CORS(app)

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    qualification = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(120),  nullable=False, default="student")

class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subject_name = db.Column(db.String(80), unique=True, nullable=False)
    subject_description = db.Column(db.String(120), nullable=False)

class Chapter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chapter_name = db.Column(db.String(80), unique=True, nullable=False)
    chapter_description = db.Column(db.String(120), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False)

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_name = db.Column(db.String(80), unique=True, nullable=False)
    quiz_description = db.Column(db.String(120), nullable=False)
    quiz_start_date = db.Column(db.String(120), nullable=False)
    quiz_end_date = db.Column(db.String(120), nullable=False)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id'), nullable=False)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    question_text = db.Column(db.String(200), nullable=False)
    option1 = db.Column(db.String(100), nullable=False)
    option2 = db.Column(db.String(100), nullable=False)
    option3 = db.Column(db.String(100), nullable=False)
    option4 = db.Column(db.String(100), nullable=False)
    correct_option = db.Column(db.Integer, nullable=False)
    
class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    selected_option = db.Column(db.Integer, nullable=False)
class Scores(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total_score = db.Column(db.Integer, nullable=False)
    
with app.app_context():
    db.create_all()
    admin_user = User.query.filter_by(category='admin').first()

    if admin_user:
        print("Admin user already exists. Skipping creation.")
    else:
            # If the admin user does not exist, create and add them
        new_admin = User(username='adm', email='adm@gmail.com',password='1234',qualification='Btech',category='admin')
        db.session.add(new_admin)
        db.session.commit()
        print("Admin user 'admin' created successfully.")


    
class UserRegister(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str, required=True)
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('qlf', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        args = parser.parse_args()
        existing_user = User.query.filter_by(username=args['username']).first()
        email = User.query.filter_by(email=args['email']).first()
        if existing_user:
            return abort(400, message='user already exists')
        if email:
            return abort(400, message='email already exists')
        if len(args['password']) < 4:
            return abort(400, message='password must be 4 charecter')
        if '@' not in args['email']:
            return abort(400, message='@ not in email')
        if args['qlf'] == '' or args['username']=="" or args['email']=="" or args['password']=="":
            return abort(400, message='qualifiaction required')
        print(args['qlf'])
        new_user = User(username=args['username'], email=args['email'], qualification=args['qlf'],password=args['password'])
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'User registered successfully'}, 201

class UserLogin(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        args = parser.parse_args()
        user = User.query.filter_by(username=args['username']).first()
        if user and user.password == args['password']:
            access_token = create_access_token(identity=str(user.id),fresh=True)
            print(access_token)
            return {'access_token': access_token, 'user': {'id': user.id, 'username': user.username, 'email': user.email, 'category': user.category}}, 200
        else:
            return {'message': 'Invalid credentials'}, 401

api.add_resource(UserRegister, '/register')  
api.add_resource(UserLogin, '/login') 
# All subject ids
class Subjects(Resource):
    @jwt_required()
    def get(self):
        subject = db.session.query(Subject).all()
        dic={}
        dic_dic={}
        for i in subject:
            dic_dic['id']=i.id
            dic_dic['subject_name']=i.subject_name
            dic_dic['subject_description']=i.subject_description
            dic[i.id]=dic_dic
            dic_dic={}
        return dic,200
api.add_resource(Subjects, '/subjects')
class Chap(Resource):
    @jwt_required()
    def get(self,subject_id):
        chapter = db.session.query(Chapter).filter_by(subject_id=subject_id).all()
        dic={}
        dic_dic={}
        for i in chapter:
            dic_dic['id']=i.id
            dic_dic['subject_id']=i.subject_id
            dic_dic['chapter_name']=i.chapter_name
            dic_dic['chapter_description']=i.chapter_description
            dic[i.id]=dic_dic
            dic_dic={}
        return dic,200
api.add_resource(Chap, '/chap/<int:subject_id>')
# Creating updting deleting and get the subject
class Subjectss(Resource):
    @jwt_required()
    def get(self, subject_id):
        subject = Subject.query.get(subject_id)
        if subject:
            return {'subject': {'id': subject.id, 'subject_name': subject.subject_name, 'subject_description': subject.subject_description}}, 200
        else:
            return {'message': 'Subject not found'}, 404
     
    @jwt_required()
    def post(self):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        parser = reqparse.RequestParser()
        parser.add_argument('subject_name', type=str)
        parser.add_argument('subject_description', type=str)
        args = parser.parse_args()
        if args['subject_name'] == '' or args['subject_description'] == '':
            return {'message': 'Subject name and description are required'}, 400
        subject = Subject.query.filter_by(subject_name=args['subject_name']).first()
        if subject:
            return {'message': 'Subject already exists'}, 400
        new_subject = Subject(subject_name=args['subject_name'], subject_description=args['subject_description'])
        db.session.add(new_subject)
        db.session.commit()
        return {'message': 'Subject created successfully'}, 201
    
    @jwt_required()
    def put(self, subject_id):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        parser = reqparse.RequestParser()
        parser.add_argument('subject_name', type=str)
        parser.add_argument('subject_description', type=str)
        args = parser.parse_args()
        subject = Subject.query.get(subject_id) 
        if args['subject_name'] == '' or args['subject_description'] == '':
            return {'message': 'Subject name and description are required'}, 400
        if subject:
            if args['subject_name']:
                subject.subject_name = args['subject_name']
            if args['subject_description']:
                subject.subject_description = args['subject_description']
            db.session.commit()
            return {'message': 'Subject updated successfully'}, 200
        else:
            return {'message': 'Subject not found'}, 404
    @jwt_required()
    def delete(self, subject_id):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        subject = db.session.query(Subject).filter(Subject.id==subject_id).first()
        if subject:
            chapter = db.session.query(Chapter).filter(Chapter.subject_id == subject.id).all()
            if chapter:
                for i in chapter:
                    quiz = db.session.query(Quiz).filter(Quiz.chapter_id == i.id).all()
                    if quiz:
                        for j in quiz:
                            answer = db.session.query(Answer).filter(Answer.quiz_id == j.id).all()
                            if answer:
                                for k in answer:
                                    db.session.delete(k)
                            question = db.session.query(Question).filter(Question.quiz_id == j.id).all()
                            if question:
                                for k in question:
                                    db.session.delete(k)
                            db.session.delete(j)
                    db.session.delete(i)
            db.session.delete(subject)
            db.session.commit()
            return {'message': 'Subject deleted successfully'}, 200
        else:
            return {'message': 'Subject not found'}, 404
api.add_resource(Subjectss,'/subj','/subj/<int:subject_id>')
# Create update delete and get the chapter    
class Chapters(Resource):
    @jwt_required()
    def get(self, chapter_id):
        chapter = Chapter.query.get(chapter_id)
        if chapter:
            return {'chapter': {'id': chapter.id, 'chapter_name': chapter.chapter_name, 'chapter_description': chapter.chapter_description}}, 200
        else:
            return {'message': 'Chapter not found'}, 404
    @jwt_required()
    def post(self):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        parser = reqparse.RequestParser()
        parser.add_argument('chapter_name', type=str)
        parser.add_argument('chapter_description', type=str)
        parser.add_argument('subject_id', type=str)
        args = parser.parse_args()
        if args['chapter_name'] == '' or args['chapter_description'] == '' or args['subject_id'] == '':
            return {'message': 'Chapter name and description and chapter id are required'}, 400
        chapter = Chapter.query.filter_by(chapter_name=args['chapter_name']).first()
        if chapter:
            return {'message': 'Chapter already exists'}, 400
        new_chapter = Chapter(chapter_name=args['chapter_name'], chapter_description=args['chapter_description'], subject_id=int(args['subject_id']))
        db.session.add(new_chapter)
        db.session.commit()
        return {'message': 'Chapter created successfully'}, 201
    @jwt_required()
    def put(self, chapter_id):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        parser = reqparse.RequestParser()
        parser.add_argument('chapter_name', type=str)
        parser.add_argument('chapter_description', type=str)
        args = parser.parse_args()
        chapter = db.session.query(Chapter).filter(Chapter.id==chapter_id).first()
        if args['chapter_name'] == '' or args['chapter_description'] == '':
            return {'message': 'Chapter name and description are required'}, 400
        if chapter:
            if args['chapter_name']:
                chapter.chapter_name = args['chapter_name']
            if args['chapter_description']:
                chapter.chapter_description = args['chapter_description']
            db.session.commit()
            return {'message': 'Chapter updated successfully'}, 200 
        else:
            return {'message': 'Chapter not found'}, 404
    
    @jwt_required()
    def delete(self, chapter_id):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        chapter = Chapter.query.get(chapter_id)
        if chapter:
            quiz = Quiz.query.filter(Quiz.chapter_id == chapter.id).all()
            if quiz:
                for i in quiz:
                    answer = Answer.query.filter(Answer.quiz_id == i.id).all()
                    if answer:
                        for j in answer:
                            db.session.delete(j)
                    question = Question.query.filter(Question.quiz_id == i.id).all()
                    if question:
                        for j in question:
                            db.session.delete(j)
                    db.session.delete(i)
            db.session.delete(chapter)
            db.session.commit()
            return {'message': 'Chapter deleted successfully'}, 200
                            
api.add_resource(Chapters,'/chap/<int:chapter_id>','/chapter')    
# Create update delete and get the quiz
class Quz(Resource):
    @jwt_required()
    def get(self,chap_id):
        quiz = db.session.query(Quiz).filter(Quiz.chapter_id==chap_id).all()
        dic={}
        dic_dic={}
        for i in quiz:
            dic_dic['id']=i.id
            dic_dic['quiz_name']=i.quiz_name
            dic_dic['quiz_description']=i.quiz_description
            dic_dic['quiz_start_date']=i.quiz_start_date
            dic_dic['quiz_end_date']=i.quiz_end_date
            dic[i.id]=dic_dic
            dic_dic={}
        return dic,200
api.add_resource(Quz,'/quz/<int:chap_id>')
class Quizez(Resource):
    @jwt_required()
    def get(self, quiz_id):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        quiz = Quiz.query.get(quiz_id)
        if quiz:
            return {'quiz': {'id': quiz.id, 'quiz_name': quiz.quiz_name, 'quiz_description': quiz.quiz_description, 'quiz_start_date': quiz.quiz_start_date, 'quiz_end_date': quiz.quiz_end_date}}, 200
        else:
            return {'message': 'Quiz not found'}, 404
    
    @jwt_required()
    def post(self):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        parser = reqparse.RequestParser()
        parser.add_argument('quiz_name', type=str)
        parser.add_argument('quiz_description', type=str)
        parser.add_argument('quiz_start_date', type=str)
        parser.add_argument('quiz_end_date', type=str)
        parser.add_argument('chapter_id', type=int)
        args = parser.parse_args()
        if args['quiz_name'] == '' or args['quiz_description'] == '' or args['quiz_start_date'] == '' or args['quiz_end_date'] == '':
            return {'message': 'Quiz name, description, start date, and end date are required'}, 400
        start_date = args['quiz_start_date']
        end_date = args['quiz_end_date']
        start_date = dt.datetime.strptime(start_date, '%Y-%m-%d')
        end_date = dt.datetime.strptime(end_date, '%Y-%m-%d')
        if start_date > end_date:
            return {'message': 'Start date must be before end date'}, 400
        quiz = Quiz.query.filter_by(quiz_name=args['quiz_name']).first()
        if quiz:
            return {'message': 'Quiz already exists'}, 400
        new_quiz = Quiz(quiz_name=args['quiz_name'], quiz_description=args['quiz_description'], quiz_start_date=args['quiz_start_date'], quiz_end_date=args['quiz_end_date'], chapter_id=args['chapter_id'])
        db.session.add(new_quiz)
        db.session.commit()
        return {'message': 'Quiz created successfully'}, 201
    
    @jwt_required()
    def put(self, quiz_id):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        parser = reqparse.RequestParser()
        parser.add_argument('quiz_name', type=str)
        parser.add_argument('quiz_description', type=str)
        parser.add_argument('quiz_start_date', type=str)
        parser.add_argument('quiz_end_date', type=str)
        args = parser.parse_args()
        quiz = Quiz.query.get(quiz_id)
        if args['quiz_name'] == '' or args['quiz_description'] == '' or args['quiz_start_date'] == '' or args['quiz_end_date'] == '':
            return {'message': 'Quiz name, description, start date, and end date are required'}, 400
        start_date = args['quiz_start_date']
        end_date = args['quiz_end_date']
        start_date = dt.datetime.strptime(start_date, '%Y-%m-%d')
        end_date = dt.datetime.strptime(end_date, '%Y-%m-%d')
        if start_date > end_date:
            return {'message': 'Start date must be before end date'}, 400
        if quiz:
            if args['quiz_name']:
                quiz.quiz_name = args['quiz_name']
            if args['quiz_description']:
                quiz.quiz_description = args['quiz_description']
            if args['quiz_start_date']:
                quiz.quiz_start_date = args['quiz_start_date']
            if args['quiz_end_date']:
                quiz.quiz_end_date = args['quiz_end_date']
            db.session.commit()
            return {'message': 'Quiz updated successfully'}, 200
        else:
            return {'message': 'Quiz not found'}, 404
    
    @jwt_required()
    def delete(self, quiz_id):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        quiz = Quiz.query.get(quiz_id)
        if quiz:
            answer = Answer.query.filter(Answer.quiz_id == quiz.id).all()
            if answer:
                for i in answer:
                    db.session.delete(i)
            question = Question.query.filter(Question.quiz_id == quiz.id).all()
            if question:
                for i in question:
                    db.session.delete(i)
            db.session.delete(quiz)
            db.session.commit()
            return {'message': 'Quiz deleted successfully'}, 200
        else:
            return {'message': 'Quiz not found'}, 404
api.add_resource(Quizez,'/admin/quizez', '/admin/quizez/<int:quiz_id>')
# Create questions 
class Qus(Resource):
    
    @jwt_required()
    def get(self,quiz_id):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        question = db.session.query(Question).filter(Question.quiz_id==quiz_id).all()
        dic={}
        dic_dic={}
        for i in question:
            dic_dic['id']=i.id
            dic_dic['question_text']=i.question_text
            dic_dic['option1']=i.option1
            dic_dic['option2']=i.option2
            dic_dic['option3']=i.option3
            dic_dic['option4']=i.option4
            dic_dic['correct_option']=i.correct_option
            dic[i.id]=dic_dic
            dic_dic={}
        return dic,200
api.add_resource(Qus,'/qus/<int:quiz_id>')
class Questions(Resource):
    
    @jwt_required()
    def post(self):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        parser = reqparse.RequestParser()
        parser.add_argument('quiz_id', type=int)
        parser.add_argument('question_text', type=str)
        parser.add_argument('option1', type=str)
        parser.add_argument('option2', type=str)
        parser.add_argument('option3', type=str)
        parser.add_argument('option4', type=str)
        parser.add_argument('correct_option', type=int)
        args = parser.parse_args()  
        if args['question_text'] == '' or args['option1'] == '' or args['option2'] == '' or args['option3'] == '' or args['option4'] == '' or args['correct_option'] == '':
            return {'message': 'Question text, options, and correct option are required'}, 400
        quiz = Quiz.query.get(args['quiz_id'])
        opt=[1,2,3,4]
        if args['correct_option'] not in opt:
            return {'message': 'Correct option must be 1, 2, 3, or 4'}, 400
        if quiz:
            question = Question(quiz_id=args['quiz_id'], question_text=args['question_text'], option1=args['option1'], option2=args['option2'], option3=args['option3'], option4=args['option4'], correct_option=args['correct_option'])
            db.session.add(question)
            db.session.commit()
            return {'message': 'Question created successfully'}, 201
        else:
            return {'message': 'Quiz not found'}, 404 
    
    @jwt_required()
    def put(self,quiz_id):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        parser = reqparse.RequestParser()
        parser.add_argument('question_text', type=str)
        parser.add_argument('option1', type=str)
        parser.add_argument('option2', type=str)
        parser.add_argument('option3', type=str)
        parser.add_argument('option4', type=str)
        parser.add_argument('correct_option', type=int)
        args = parser.parse_args()
        if args['question_text'] == '' or args['option1'] == '' or args['option2'] == '' or args['option3'] == '' or args['option4'] == '' or args['correct_option'] == '':
            return {'message': 'Question text, options, and correct option are required'}, 400
        opt=[1,2,3,4]
        question = Question.query.get(quiz_id)
        if args['correct_option'] not in [1, 2, 3, 4]:
            return {'message': 'Correct option must be 1, 2, 3, or 4'}, 400
        if question:
            if args['question_text']:
                question.question_text = args['question_text']
            if args['option1']:
                question.option1 = args['option1']
            if args['option2']:
                question.option2 = args['option2']
            if args['option3']:
                question.option3 = args['option3']
            if args['option4']:
                question.option4 = args['option4']
            if args['correct_option']:
                question.correct_option = args['correct_option']
            db.session.commit()
            return {'message': 'Question updated successfully'}, 200
        else:
            return {'message': 'Question not found'}, 404
    
    @jwt_required()
    def delete(self,quiz_id):
        idt = get_jwt_identity()
        usr = db.session.query(User).filter(User.id==int(idt)).first()
        if usr.category != 'admin':
            return {'message':'This is only for admin'},400
        question = Question.query.get(quiz_id)
        if question:
            answer = Answer.query.filter(Answer.question_id == question.id).all()
            if answer:
                for i in answer:
                    db.session.delete(i)
            db.session.delete(question)
            db.session.commit()
            return {'message': 'Question deleted successfully'}, 200
api.add_resource(Questions,'/questions','/question/<int:quiz_id>')
# Answers
class Answers(Resource):
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_name', type=str)
        parser.add_argument('Questions', type=str)
        parser.add_argument('quiz_id', type=int)
        args = parser.parse_args() 
        quz=args['quiz_id']  
        ques=args['Questions']
        try:
            ques=eval(ques)
        except:
            return {'message': 'Questions must be in dictionary format'}, 400
        usr_name=args['user_name']
        qz=db.session.query(Quiz).filter(Quiz.id==quz).first()
        if qz is None:
            return {'message': 'Quiz not found'}, 404
        today_date=dt.datetime.now()
        today_date=today_date.strftime('%Y-%m-%d')
        today_date=dt.datetime.strptime(today_date,'%Y-%m-%d')
        quz_st_dt = dt.datetime.strptime(qz.quiz_start_date,'%Y-%m-%d')
        quz_end_dt = dt.datetime.strptime(qz.quiz_end_date,'%Y-%m-%d')
        if today_date<quz_st_dt or today_date>quz_end_dt:
            return {'message': 'Quiz is not active'}, 400
        usr = db.session.query(User).filter(User.username==usr_name).first()
        Qs=db.session.query(Question).filter(Question.quiz_id==quz).all()
        if len(Qs)!=len(ques):
            return {'message': 'Number of questions must be equal to number of answers'}, 400
        if usr is None:
            return {'message': 'User not found'}, 404
        for i in ques:
            ans=ques[i]
            if ans not in [1,2,3,4]:
                return {'message': 'Answer must be 1, 2, 3, or 4'}, 400
            ans1=db.session.query(Answer).filter(Answer.user_id==usr.id,Answer.question_id==i).first()
            if ans1:
                db.session.delete(ans1)
                db.session.flush()
            answer = Answer(user_id=usr.id, question_id=i, quiz_id=quz, selected_option=ans)
            db.session.add(answer)
            db.session.flush()
        ques1=db.session.query(Question).filter(Question.quiz_id==quz).all()    
        scr=db.session.query(Scores).filter(Scores.user_id==usr.id,Scores.quiz_id==quz).first()
        count=0
        for i in range(len(ques1)):
            ans=ques[str(ques1[i].id)]
            if ques1[i].correct_option==ans:
                count+=1
        if scr:
            db.session.delete(scr)
            db.session.flush()
        score=Scores(user_id=usr.id,quiz_id=quz,score=count,total_score=len(ques1))
        db.session.add(score)
        db.session.flush()
        db.session.commit()
        return {"message":"Successful"},200
api.add_resource(Answers,'/answers')
class Sb_Ans(Resource):
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_name', type=str)
        parser.add_argument('quiz_id', type=int) 
        args = parser.parse_args()
        usr_id=args['user_name']
        quiz_id=args['quiz_id']
        usr=db.session.query(User).filter(User.username==usr_id).first()
        quiz=db.session.query(Quiz).filter(Quiz.id==quiz_id).first()
        if usr is None:
            return {'message': 'User not found'}, 404
        if quiz is None:
            return {'message': 'Quiz not found'}, 404   
        ans=db.session.query(Answer).filter(Answer.user_id==usr.id,Answer.quiz_id==quiz.id).all()   
        dic={}
        for i in ans:
            dic_dic={}
            dic_dic['question']=i.question_id
            dic_dic['answer']=i.selected_option
            dic[i.id]=dic_dic
        return dic,200   
api.add_resource(Sb_Ans,'/sb_ans')
# Start Quiz
class StartQuiz(Resource):
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int)
        parser.add_argument('quiz_id', type=int)
        args = parser.parse_args()
        quiz = Quiz.query.get(args['quiz_id'])
        if quiz:
            start_quiz = StartQuiz(user_id=args['user_id'], quiz_id=args['quiz_id'])
            db.session.add(start_quiz)
            db.session.commit()
            return {'message': 'Quiz started successfully'}, 201
class Qus_stu(Resource):
    @jwt_required()
    def get(self,quiz_id):
        question = db.session.query(Question).filter(Question.quiz_id==quiz_id).all()
        dic={}
        dic_dic={}
        today_date=dt.datetime.now()
        today_date=today_date.strftime('%Y-%m-%d')
        today_date=dt.datetime.strptime(today_date,'%Y-%m-%d')
        quz = db.session.query(Quiz).filter(Quiz.id==quiz_id).first()
        quz_st_dt = dt.datetime.strptime(quz.quiz_start_date,'%Y-%m-%d')
        quz_end_dt = dt.datetime.strptime(quz.quiz_end_date,'%Y-%m-%d')
        if quz_st_dt>today_date:
            return {'message':'Quiz is not started yet'},400
        if quz_end_dt<today_date:
            return {'message':'Quiz is ended'},400
        for i in question:
            dic_dic['id']=i.id
            dic_dic['question_text']=i.question_text
            dic_dic['option1']=i.option1
            dic_dic['option2']=i.option2
            dic_dic['option3']=i.option3
            dic_dic['option4']=i.option4
            dic[i.id]=dic_dic
            dic_dic={}
        return dic,200
api.add_resource(Qus_stu,'/stu/qus/<int:quiz_id>')


class Check_Socre(Resource):
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int)
        parser.add_argument('quiz_id', type=int)
        args = parser.parse_args()
        quiz = Quiz.query.get(args['quiz_id'])
        if quiz:
            score = Scores.query.filter(Scores.user_id==args['user_id'],Scores.quiz_id==args['quiz_id']).first()
            if score:
                return {'message': 'Your score is '+str(score.score)+' out of '+str(score.total_score)}, 200
            else:
                return {'message': 'You have not answered the quiz'}, 200
        else:
            return {'message': 'Quiz not found'}, 404
api.add_resource(Check_Socre,'/check_score')
class Check_students_Socre(Resource):
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('quiz_id', type=int)
        parser.add_argument('user_name', type=str)
        args = parser.parse_args()
        quiz = Quiz.query.get(args['quiz_id'])
        username = args['user_name']
        usr = db.session.query(User).filter(User.username==username).first()
        
        if quiz:
            score = db.session.query(Scores).filter(Scores.quiz_id==args['quiz_id'],Scores.user_id==usr.id).first()
            dic={}
            dic_dic={}
            if score:
                dic_dic['score']=score.score
                dic_dic['total_score']=score.total_score
                dic[usr.id]=dic_dic
                return dic,200
            else:
                return {'message': 'You have not answered the quiz'}, 200
        else:
            return {'message': 'Quiz not found'}, 404   
api.add_resource(Check_students_Socre,'/check_students_score')

class Admin_Stu(Resource):
    @jwt_required()
    def get(self):
        usr = db.session.query(User).filter(User.category=='student').all()
        dic={}
        dic_dic={}
        if not usr:
            return {'message': 'No students found'}, 404
        for i in usr:
            dic_dic['id']=i.id
            dic_dic['username']=i.username
            dic_dic['email']=i.email    
            dic_dic['qualification']=i.qualification
            dic[i.id]=dic_dic
            dic_dic={}
        return dic,200
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int)
        args = parser.parse_args()
        usr = db.session.query(User).filter(User.id==args['user_id']).first()
        dic_user_details={
            'id':usr.id,
            'username':usr.username,
            'category':usr.category
        }
        return dic_user_details,200
class Show_quiz_admin(Resource):
    @jwt_required()
    def get(self,user_id,chapter_id):
        usr = db.session.query(User).filter(User.id==user_id).first()
        if usr:
            quiz=db.session.query(Quiz).filter(Quiz.chapter_id==chapter_id).all()
            dic={}
            dic_dic={}
            if quiz:
                for i in quiz:
                    scores=db.session.query(Scores).filter(Scores.user_id==user_id,Scores.quiz_id==i.id).first()
                    dic_dic['chapter_id']=chapter_id
                    dic_dic['user_id']=user_id
                    dic_dic['quiz_id']=i.id
                    dic_dic['quiz_name']=i.quiz_name
                    dic_dic['quiz_description']=i.quiz_description
                    dic_dic['quiz_start_date']=i.quiz_start_date
                    dic_dic['quiz_end_date']=i.quiz_end_date
                    if scores:
                        dic_dic['score']=scores.score
                        dic_dic['total_score']=scores.total_score
                    else:
                        dic_dic['score']=0
                        dic_dic['total_score']=0
                    dic[i.id]=dic_dic
                    dic_dic={}
                return dic,200
            else:
                return {'message': 'No quiz found'}, 404
        else:
            return {'message': 'User not found'}, 404
api.add_resource(Show_quiz_admin,'/show_quiz_admin/<int:user_id>/<int:chapter_id>')
api.add_resource(Admin_Stu,'/admin_stats')


class Adm_stats_1(Resource):
    @jwt_required()
    def get(self):
        usr = db.session.query(User).filter(User.category=='student').count()
        sub = db.session.query(Subject).count()
        chp = db.session.query(Chapter).count()
        quiz = db.session.query(Quiz).count()
        attempt=db.session.query(Scores.quiz_id).distinct().count()
        dic={}
        dic['student']=usr
        dic['subjects']=sub
        dic['chapters']=chp
        dic['quiz']=quiz
        dic['attempt']=attempt
        return dic,200
api.add_resource(Adm_stats_1,'/adm_stats_1')

class Stu_stats(Resource):
    @jwt_required()
    def get(self,username):
        usr = db.session.query(User).filter(User.username==username).filter(User.category=='student').first()
        quiz = db.session.query(Quiz).count()
        attempt=db.session.query(Scores.quiz_id).filter(Scores.user_id==usr.id).distinct().count()
        pending=quiz-attempt
        dic={}
        dic['quiz']=quiz    
        dic['attempt']=attempt
        dic['pending']=pending
        return dic,200  
api.add_resource(Stu_stats,'/stu_stats/<string:username>')

class all_details(Resource):
    @jwt_required()
    def get(self):
        search_results = db.session.query(Quiz,Chapter,Subject).join(Chapter,Quiz.chapter_id==Chapter.id).join(Subject,Chapter.subject_id==Subject.id).all()
        dic={}
        dic_dic={}
        for i in search_results:
            dic_dic['quiz_id']=i[0].id
            dic_dic['quiz_name']=i[0].quiz_name
            dic_dic['quiz_description']=i[0].quiz_description
            dic_dic['quiz_start_date']=i[0].quiz_start_date 
            dic_dic['quiz_end_date']=i[0].quiz_end_date
            dic_dic['chapter_id']=i[1].id
            dic_dic['chapter_name']=i[1].chapter_name
            dic_dic['subject_id']=i[2].id
            dic_dic['subject_name']=i[2].subject_name
            dic[i[0].id]=dic_dic    
            dic_dic={}
        return dic,200
api.add_resource(all_details,'/all_details')


if __name__ == '__main__':
    #DEBUG is SET to TRUE. CHANGE FOR PROD
    app.run(port=5000,debug=True)