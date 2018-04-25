# -*- coding: utf-8 -*-
from django import forms

class fm_txt2png(forms.Form):
  title=forms.CharField()
  text=forms.Field(widget=forms.Textarea)
