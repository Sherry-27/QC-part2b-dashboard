"""Verify Chapter 10 Exercises 10-40 through 10-59.

All observations are fixed textbook values. Randomness is used only for
optional, seeded probability checks in the web dashboard.
"""
from __future__ import annotations
import json, math
from pathlib import Path
import matplotlib.pyplot as plt
import numpy as np

ROOT=Path(__file__).resolve().parent
FIGURES=ROOT/"figures"
FIGURES.mkdir(exist_ok=True)
M44=np.array([49.4,49.9,48.8,50.1,49.7,48.1,48.6,48.7,50.7,51.3,51.1,51.6,50,50.5,51.4,50.1])
R44=np.array([4,7,7,4,7,10,7,10,6,4,9,9,6,7,4,7])
M50=np.array([75.3,75,74.8,75,75.3,74.8,74.8,74.9,74.6,74.9,75.2,75.1,74.8,74.9,74.9,75.1,75,74.9,74.9,75.1])
R50=np.array([3.2,3.3,3.6,3.5,3.8,3.7,3.4,3.3,3.4,3.1,3.1,3,3.1,2.9,2.8,2.8,2.7,2.9,2.8,2.9])
AUDITS=np.array([2,1,2,3,5,4,5,6,3,1,1,3,2,2,3,2])
DEFECTS=np.array([3,1,2,4,4,2,2,3,1,0,2,2,1,3,2,2,0,4,2,0])

def binom_cdf(n,c,p):
    return sum(math.comb(n,k)*p**k*(1-p)**(n-k) for k in range(c+1))
def pois_cdf(lam,c):
    return sum(math.exp(-lam)*lam**k/math.factorial(k) for k in range(c+1))
def xlimits(means,ranges,a2):
    center=float(means.mean());rbar=float(ranges.mean())
    return center,rbar,center-a2*rbar,center+a2*rbar
def decorate(ax,title,ylabel):
    ax.set_title(title,loc="left",fontweight="bold");ax.set_ylabel(ylabel);ax.grid(axis="y",alpha=.22);ax.spines[["top","right"]].set_visible(False)
def chart(ax,values,cl,lcl,ucl,title,ylabel):
    x=np.arange(1,len(values)+1);ax.plot(x,values,"o-",color="#087f78",lw=1.8,ms=4)
    ax.axhline(cl,color="#c06c1b",ls=(0,(2,3)),label=f"CL {cl:.4f}");ax.axhline(ucl,color="#b72f3a",ls="--",label=f"UCL {ucl:.4f}");ax.axhline(lcl,color="#b72f3a",ls="--",label=f"LCL {lcl:.4f}")
    ax.set_xlabel("Subgroup");ax.legend(frameon=False,ncol=3,fontsize=8);decorate(ax,title,ylabel)

def figures():
    u40=.02+3*math.sqrt(.02*.98/125)
    fig,ax=plt.subplots(figsize=(10,4.8));chart(ax,AUDITS/125,.02,0,u40,"Exercise 10-40: weekly audit p chart","Proportion audited");fig.tight_layout();fig.savefig(FIGURES/"q10-40_p_chart.png",dpi=180);plt.close(fig)
    x,r,l,u=xlimits(M44,R44,.308);fig,axes=plt.subplots(2,1,figsize=(10,8),sharex=True);chart(axes[0],M44,x,l,u,"Exercises 10-44 and 10-45: Global Bank","Checks / two minutes");chart(axes[1],R44,r,.223*r,1.777*r,"Range chart","Range");fig.tight_layout();fig.savefig(FIGURES/"q10-44_45_control_charts.png",dpi=180);plt.close(fig)
    labels=["Wallboard","Electrical","Other","Tile","Heating/AC","Roofing","Flooring","Plumbing","Painting","Windows"];values=np.array([303,257,68,51,35,31,23,22,19,16])
    fig,ax=plt.subplots(figsize=(11,5.5));ax.bar(labels,values,color="#247d8e");ax.tick_params(axis="x",rotation=35);ax2=ax.twinx();ax2.plot(labels,np.cumsum(values)/825*100,"o-",color="#c06c1b");ax2.axhline(80,color="#b72f3a",ls="--");ax2.set_ylim(0,105);ax2.set_ylabel("Cumulative %");decorate(ax,"Exercise 10-46: subcontractor Pareto","Problems");fig.tight_layout();fig.savefig(FIGURES/"q10-46_pareto.png",dpi=180);plt.close(fig)
    plans=[(200,1),(200,2),(250,1),(250,2)];alpha=[1-binom_cdf(n,c,.01) for n,c in plans];beta=[binom_cdf(n,c,.015) for n,c in plans]
    x=np.arange(4);fig,ax=plt.subplots(figsize=(9,5));ax.bar(x-.18,alpha,.36,label="Producer alpha",color="#247d8e");ax.bar(x+.18,beta,.36,label="Consumer beta",color="#c06c1b");ax.set_xticks(x,[f"n={n}, c={c}" for n,c in plans]);ax.legend(frameon=False);decorate(ax,"Exercises 10-47 and 10-48: risk trade-off","Probability");fig.tight_layout();fig.savefig(FIGURES/"q10-47_48_acceptance_risks.png",dpi=180);plt.close(fig)
    x,r,l,u=xlimits(M50,R50,.157);fig,axes=plt.subplots(2,1,figsize=(10,8),sharex=True);chart(axes[0],M50,x,l,u,"Exercises 10-50 and 10-51: disk coating","Mean thickness (microns)");chart(axes[1],R50,r,.452*r,1.548*r,"Range chart","Range (microns)");fig.tight_layout();fig.savefig(FIGURES/"q10-50_51_control_charts.png",dpi=180);plt.close(fig)
    u52=.001+3*math.sqrt(.001*.999/2000);fig,ax=plt.subplots(figsize=(10,4.8));chart(ax,DEFECTS/2000,.001,0,u52,"Exercise 10-52: Photomatic p chart","Proportion defective");fig.tight_layout();fig.savefig(FIGURES/"q10-52_p_chart.png",dpi=180);plt.close(fig)
    ps=np.linspace(0,.05,201);pa=np.array([pois_cdf(300*p,3) for p in ps]);fig,ax=plt.subplots(figsize=(9,5));ax.plot(ps*100,pa,label="Consumer beta / P(accept)",color="#087f78");ax.plot(ps*100,1-pa,label="Producer alpha / P(reject)",color="#b72f3a");ax.set_xlabel("Percent defective");ax.set_ylim(0,1);ax.legend(frameon=False);decorate(ax,"Exercises 10-55 and 10-56: OC risks","Probability");fig.tight_layout();fig.savefig(FIGURES/"q10-55_56_oc_curve.png",dpi=180);plt.close(fig)

def calculate():
    phat=45/2000;z=(phat-.02)/math.sqrt(.02*.98/2000);plans=[(200,1),(200,2),(250,1),(250,2)]
    x44,r44,l44,u44=xlimits(M44,R44,.308);x50,r50,l50,u50=xlimits(M50,R50,.157)
    return {
      "10-40":{"p_hat":phat,"z":z,"one_sided_p":.5*math.erfc(z/math.sqrt(2)),"p_chart_ucl":.02+3*math.sqrt(.02*.98/125)},
      "10-44":{"center":x44,"rbar":r44,"lcl":l44,"ucl":u44},"10-45":{"center":r44,"lcl":.223*r44,"ucl":1.777*r44},
      "10-46":{"total":825,"top_two_share":560/825},
      "10-47":{"producer_risks":[1-binom_cdf(n,c,.01) for n,c in plans]},"10-48":{"consumer_risks":[binom_cdf(n,c,.015) for n,c in plans]},
      "10-50":{"center":x50,"rbar":r50,"lcl":l50,"ucl":u50},"10-51":{"center":r50,"lcl":.452*r50,"ucl":1.548*r50},
      "10-52":{"overall_p":float(DEFECTS.sum()/(20*2000)),"ucl":.001+3*math.sqrt(.001*.999/2000)},
      "10-55":{"producer_risks":[1-pois_cdf(300*p,3) for p in (.005,.01,.015)]},"10-56":{"consumer_risks":[pois_cdf(300*p,3) for p in (.01,.015,.02)]}
    }
if __name__=="__main__":
    results=calculate();figures();(ROOT/"verification_results.json").write_text(json.dumps(results,indent=2),encoding="utf-8");print(json.dumps(results,indent=2));print(f"Figures saved in {FIGURES}")
