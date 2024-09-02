package jvbz.boot.vss.inquiry.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Inquiry")
public class Inquiry {
	@Id
	@Column(name ="inquiry_num")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "inquiry_num_seq")
    @SequenceGenerator(name = "inquiry_num_seq", sequenceName = "inquiry_numplus", allocationSize = 1)
	private int inquiryNum;
	
	@Column(name = "user_id")
	private String userId;
	
	@Column(name = "inquiry_title", length = 200)
	private String inquiryTitle;
	
	@Column(name = "inquiry_content", length = 2000)
	private String inquiryContent;
	
	@Column(name = "inquiry_date")
	private String inquiryDate;
	
	@Column(name = "inquiry_answer")
	private String inquiryAnswer;
	
//	@Column(name = "inquiry_status")
//	private int inquiryStatus;
}
